const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. /api/draws/execute will fail without service role.');
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  global: { headers: { 'Content-Type': 'application/json' } }
});

// POST /api/draws/execute
// body: { contestId, executedBy, numberOfWinners, prizeIds }
router.post('/execute', async (req, res) => {
  try {
    console.log('POST /api/draws/execute request body:', req.body);
    const { contestId, executedBy, numberOfWinners, prizeIds } = req.body;

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server environment');
      return res.status(500).json({ success: false, error: 'Server not configured with Supabase service role key' });
    }

    if (!contestId || !numberOfWinners) {
      return res.status(400).json({ error: 'Missing contestId or numberOfWinners' });
    }

    // Fetch validated participants
    const { data: participants, error: partErr } = await supabase
      .from('participants')
      .select('*')
      .eq('contest_id', contestId)
      .eq('validated', true)
      .order('entry_timestamp', { ascending: true });

    if (partErr) throw partErr;
    if (!participants || participants.length === 0) {
      return res.status(400).json({ error: 'No validated participants found' });
    }

    if (numberOfWinners > participants.length) {
      return res.status(400).json({ error: 'Number of winners cannot exceed participants' });
    }

    // Ensure there are enough prize slots remaining for this contest
    // Sum prize quantities for the contest
    const { data: prizesForContest, error: prizesErr } = await supabase
      .from('prizes')
      .select('prize_id, quantity')
      .eq('contest_id', contestId);

    if (prizesErr) throw prizesErr;

    const totalPrizeSlots = (prizesForContest || []).reduce((sum, p) => sum + (p.quantity || 0), 0);

    // Count already allocated winners for this contest by fetching draws for contest and counting winners
    const { data: drawsForContest, error: drawsErr } = await supabase
      .from('draws')
      .select('draw_id')
      .eq('contest_id', contestId);

    if (drawsErr) throw drawsErr;

    const drawIds = (drawsForContest || []).map(d => d.draw_id);

    let existingWinnersCount = 0;
    if (drawIds.length > 0) {
      const { data: existingWinners } = await supabase
        .from('winners')
        .select('winner_id')
        .in('draw_id', drawIds);
      existingWinnersCount = (existingWinners || []).length;
    }

    const remainingPrizeSlots = totalPrizeSlots - existingWinnersCount;
    if (numberOfWinners > remainingPrizeSlots) {
      return res.status(400).json({ error: `Not enough prizes remaining. Requested ${numberOfWinners}, but only ${remainingPrizeSlots} prize slots are available.` });
    }

    // Create the draw
    const { data: draw, error: drawErr } = await supabase
      .from('draws')
      .insert({
        contest_id: contestId,
        draw_mode: 'RANDOM',
        executed_by: executedBy,
        total_winners: numberOfWinners,
      })
      .select()
      .single();

    if (drawErr) throw drawErr;

    // Random selection
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numberOfWinners);

    // Insert winners
    const winnerInserts = selected.map((p, idx) => ({
      draw_id: draw.draw_id,
      participant_id: p.participant_id,
      // capture the participant name redundantly on the winner row for easier reporting
      winner_name: p.name || null,
      prize_id: (prizeIds && prizeIds[idx]) || null,
      prize_status: 'PENDING',
      notified: false,
    }));

    const { data: winners, error: winnersErr } = await supabase
      .from('winners')
      .insert(winnerInserts)
      .select();

    if (winnersErr) throw winnersErr;

    // Return draw and winners with participant info
    const { data: winnersWithJoins, error: joinedErr } = await supabase
      .from('winners')
      .select(`*, participants(*), prizes(*), draws(*)`)
      .eq('draw_id', draw.draw_id);

    if (joinedErr) throw joinedErr;

    console.log(`Draw ${draw.draw_id} created with ${winnersWithJoins.length} winners`);
    res.json({ success: true, draw, winners: winnersWithJoins });
  } catch (error) {
    console.error('Error in /api/draws/execute:', error);
    res.status(500).json({ success: false, error: error.message || error });
  }
});

module.exports = router;
