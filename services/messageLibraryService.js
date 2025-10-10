const axios = require('axios');

// Message Library Integration Service
class MessageLibraryService {
  constructor() {
    // This should point to your frontend's message library API
    // For now, we'll use in-memory storage similar to triggers
    this.messages = [
      // Interactive Button Messages
      {
        messageId: 'msg_welcome_interactive',
        name: 'Welcome - Interactive Menu',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'Welcome to Hospital Services! 🏥',
          body: 'Hello! How can we assist you today? Please choose an option below:',
          footer: 'Powered by Hospital Management System',
          buttons: [
            {
              buttonId: 'btn_book_appointment',
              title: '📅 Book Appointment',
              triggerId: 'trigger_book_appointment',
              nextAction: 'send_message',
              targetMessageId: 'msg_book_interactive'
            },
            {
              buttonId: 'btn_lab_tests',
              title: '🧪 Lab Tests',
              triggerId: 'trigger_lab_tests',
              nextAction: 'send_message',
              targetMessageId: 'msg_lab_interactive'
            },
            {
              buttonId: 'btn_emergency',
              title: '🚨 Emergency',
              triggerId: 'trigger_emergency',
              nextAction: 'send_message',
              targetMessageId: 'msg_emergency'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_book_interactive',
        name: 'Book Appointment - Interactive',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'Book Your Appointment 📅',
          body: 'Which type of appointment would you like to book?',
          footer: 'Select your preferred option',
          buttons: [
            {
              buttonId: 'btn_general_checkup',
              title: '👩‍⚕️ General Checkup',
              triggerId: 'trigger_general_checkup',
              nextAction: 'send_message',
              targetMessageId: 'msg_doctor_selection'
            },
            {
              buttonId: 'btn_specialist',
              title: '🩺 Specialist',
              triggerId: 'trigger_specialist',
              nextAction: 'send_message',
              targetMessageId: 'msg_specialist_selection'
            },
            {
              buttonId: 'btn_back_main',
              title: '⬅️ Back to Main',
              triggerId: 'trigger_back_main',
              nextAction: 'send_message',
              targetMessageId: 'msg_welcome_interactive'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_doctor_selection',
        name: 'Doctor Selection - Interactive',
        type: 'interactive_list',
        status: 'published',
        contentPayload: {
          header: 'Available Doctors 👩‍⚕️',
          body: 'Please select a doctor for your appointment:',
          footer: 'All doctors are available for booking',
          buttonText: 'Choose Doctor',
          sections: [
            {
              title: 'General Physicians',
              rows: [
                {
                  rowId: 'dr_sharma',
                  title: 'Dr. Sharma',
                  description: 'General Physician - Available Mon-Fri',
                  triggerId: 'trigger_dr_sharma',
                  nextAction: 'send_message',
                  targetMessageId: 'msg_sharma_slots_interactive'
                },
                {
                  rowId: 'dr_patel',
                  title: 'Dr. Patel',
                  description: 'General Physician - Available Tue-Sat',
                  triggerId: 'trigger_dr_patel',
                  nextAction: 'send_message',
                  targetMessageId: 'msg_patel_slots_interactive'
                }
              ]
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma_slots_interactive',
        name: 'Dr. Sharma Slots - Interactive',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'Dr. Sharma - Available Slots 📅',
          body: 'Please select your preferred time slot:',
          footer: 'Consultation fee: ₹750',
          buttons: [
            {
              buttonId: 'btn_slot_930',
              title: '🕘 Mon 9:30 AM',
              triggerId: 'trigger_slot_930',
              nextAction: 'send_message',
              targetMessageId: 'msg_confirm_appointment'
            },
            {
              buttonId: 'btn_slot_4pm',
              title: '🕐 Wed 4:00 PM',
              triggerId: 'trigger_slot_4pm',
              nextAction: 'send_message',
              targetMessageId: 'msg_confirm_appointment'
            },
            {
              buttonId: 'btn_back_doctors',
              title: '⬅️ Back to Doctors',
              triggerId: 'trigger_back_doctors',
              nextAction: 'send_message',
              targetMessageId: 'msg_doctor_selection'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_confirm_appointment',
        name: 'Confirm Appointment - Interactive',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'Confirm Your Appointment ✅',
          body: 'Appointment Details:\n👨‍⚕️ Dr. Sharma\n📅 Monday, Oct 14\n🕘 9:30 AM\n💰 Fee: ₹750\n\nWould you like to confirm and proceed to payment?',
          footer: 'You can reschedule if needed',
          buttons: [
            {
              buttonId: 'btn_confirm_pay',
              title: '✅ Confirm & Pay',
              triggerId: 'trigger_confirm_pay',
              nextAction: 'send_message',
              targetMessageId: 'msg_payment_link'
            },
            {
              buttonId: 'btn_reschedule',
              title: '🔄 Reschedule',
              triggerId: 'trigger_reschedule',
              nextAction: 'send_message',
              targetMessageId: 'msg_sharma_slots_interactive'
            },
            {
              buttonId: 'btn_cancel',
              title: '❌ Cancel',
              triggerId: 'trigger_cancel',
              nextAction: 'send_message',
              targetMessageId: 'msg_welcome_interactive'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_payment_link',
        name: 'Payment Link - Interactive',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'Payment Required 💳',
          body: 'Please complete your payment to confirm the appointment:\n\n💰 Amount: ₹750\n🏥 Dr. Sharma Consultation\n📅 Monday, Oct 14, 9:30 AM\n\n[Payment Link: https://pay.hospital.com/abc123]',
          footer: 'Secure payment powered by Razorpay',
          buttons: [
            {
              buttonId: 'btn_payment_done',
              title: '✅ Payment Completed',
              triggerId: 'trigger_payment_done',
              nextAction: 'send_message',
              targetMessageId: 'msg_appointment_confirmed'
            },
            {
              buttonId: 'btn_payment_help',
              title: '❓ Payment Help',
              triggerId: 'trigger_payment_help',
              nextAction: 'send_message',
              targetMessageId: 'msg_payment_support'
            },
            {
              buttonId: 'btn_cancel_payment',
              title: '❌ Cancel',
              triggerId: 'trigger_cancel_payment',
              nextAction: 'send_message',
              targetMessageId: 'msg_welcome_interactive'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_appointment_confirmed',
        name: 'Appointment Confirmed - Interactive',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: 'Appointment Confirmed! 🎉',
          body: 'Your appointment has been successfully booked:\n\n🎫 Token: GM-015\n👨‍⚕️ Dr. Sharma\n📅 Monday, Oct 14\n🕘 9:30 AM\n🏥 Room 201, 2nd Floor\n\nPlease arrive 15 minutes early.',
          footer: 'Thank you for choosing our hospital',
          buttons: [
            {
              buttonId: 'btn_add_calendar',
              title: '📅 Add to Calendar',
              triggerId: 'trigger_add_calendar',
              nextAction: 'send_message',
              targetMessageId: 'msg_calendar_added'
            },
            {
              buttonId: 'btn_book_another',
              title: '➕ Book Another',
              triggerId: 'trigger_book_another',
              nextAction: 'send_message',
              targetMessageId: 'msg_book_interactive'
            },
            {
              buttonId: 'btn_main_menu',
              title: '🏠 Main Menu',
              triggerId: 'trigger_main_menu',
              nextAction: 'send_message',
              targetMessageId: 'msg_welcome_interactive'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_lab_interactive',
        name: 'Lab Tests - Interactive',
        type: 'interactive_list',
        status: 'published',
        contentPayload: {
          header: 'Laboratory Services 🧪',
          body: 'Choose the type of lab test you need:',
          footer: 'All tests include home collection option',
          buttonText: 'Select Test',
          sections: [
            {
              title: 'Common Tests',
              rows: [
                {
                  rowId: 'test_blood_sugar',
                  title: 'Blood Sugar Test',
                  description: 'Fasting & Random - ₹200',
                  triggerId: 'trigger_blood_sugar',
                  nextAction: 'send_message',
                  targetMessageId: 'msg_blood_sugar_booking'
                },
                {
                  rowId: 'test_full_body',
                  title: 'Full Body Checkup',
                  description: 'Complete health screening - ₹1200',
                  triggerId: 'trigger_full_body',
                  nextAction: 'send_message',
                  targetMessageId: 'msg_full_body_booking'
                }
              ]
            },
            {
              title: 'Specialized Tests',
              rows: [
                {
                  rowId: 'test_cardiac',
                  title: 'Cardiac Profile',
                  description: 'Heart health assessment - ₹800',
                  triggerId: 'trigger_cardiac',
                  nextAction: 'send_message',
                  targetMessageId: 'msg_cardiac_booking'
                }
              ]
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_emergency',
        name: 'Emergency Services - Interactive',
        type: 'interactive_button',
        status: 'published',
        contentPayload: {
          header: '🚨 Emergency Services',
          body: 'This is for medical emergencies only. If this is a life-threatening situation, please call 108 immediately.\n\nFor non-emergency urgent care, choose an option:',
          footer: 'Emergency helpline: 108',
          buttons: [
            {
              buttonId: 'btn_urgent_care',
              title: '🏥 Urgent Care',
              triggerId: 'trigger_urgent_care',
              nextAction: 'send_message',
              targetMessageId: 'msg_urgent_care_info'
            },
            {
              buttonId: 'btn_ambulance',
              title: '🚑 Book Ambulance',
              triggerId: 'trigger_ambulance',
              nextAction: 'send_message',
              targetMessageId: 'msg_ambulance_booking'
            },
            {
              buttonId: 'btn_call_emergency',
              title: '📞 Call Emergency',
              triggerId: 'trigger_call_emergency',
              nextAction: 'send_message',
              targetMessageId: 'msg_emergency_contact'
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_hi',
        name: 'Welcome - Existing Patient Menu',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Welcome back, Anil Kumar! 👋 What would you like to do today?\n1️⃣ Book Doctor Appointment → book\n2️⃣ Book Lab Test → lab\n3️⃣ Order Medicines → meds\n4️⃣ View Reports → rep'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_book',
        name: 'Doctor Selection',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Okay. Which Doctor/Department would you like to book for?\n1️⃣ Dr. Sharma → sharma\n2️⃣ Cardiology → cardio\n3️⃣ Orthopaedics → ortho\n4️⃣ Other → other'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma',
        name: 'Dr. Sharma Slots',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Dr. Sharma\'s next available slots:\n1️⃣ Mon, Oct 14, 9:30 AM → 930\n2️⃣ Wed, Oct 16, 4:00 PM → 4pm'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma930',
        name: 'Confirm 9:30 AM Slot',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Confirming Dr. Sharma, Mon, Oct 14, 9:30 AM. Fee ₹750.\nPlease pay now. [Payment Link]\nAfter payment, type donepay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_sharma4pm',
        name: 'Confirm 4:00 PM Slot',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Confirming Dr. Sharma, Wed, Oct 16, 4:00 PM. Fee ₹750.\nPlease pay now. [Payment Link]\nAfter payment, type donepay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_donepay',
        name: 'Appointment Confirmed',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Appointment Confirmed! 🎉 Token: GM-015.\nWould you like to view your prescription or lab test? Type meds or lab.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_lab',
        name: 'Lab Test Booking',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Dr. Sharma has advised a Full Body Checkup. Total ₹1200.\nPay to confirm. [Payment Link]\nAfter payment, type lpay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_labpay',
        name: 'Lab Test Confirmed',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Lab Test Confirmed! Token L-035.\nPlease proceed to the 2nd Floor Laboratory.\nOnce done, type lrep to check for results.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_labrep',
        name: 'Lab Report Ready',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Good news! Your Full Body Checkup report is ready.\nClick to view/download: [Report Link]\nTo order prescribed medicines, type meds.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_meds',
        name: 'Medicine Order',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Dr. Sharma\'s prescription is ready:\n1. Paracetamol (10 tabs)\n2. Vitamin D (5 tabs)\nTotal: ₹450\nTo confirm and pay, type confirm.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_ok',
        name: 'Medicine Payment',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Click to pay and confirm your medicine order. [Payment Link]\nAfter payment, type medpay.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_medpay',
        name: 'Medicine Confirmed',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Medicine Order Confirmed! 🎉 ID: PH-567.\nCollect from Pharmacy in 15 minutes.\nLater, type check for follow-up.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_check',
        name: 'Follow-up Check',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'How are you feeling after taking your medicines?\n1️⃣ Better → better\n2️⃣ Same → same\n3️⃣ Worse → worse'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_better',
        name: 'Feeling Better',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'That\'s wonderful! We\'ve updated Dr. Sharma.\nTo schedule your next review, type remind.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_same',
        name: 'Feeling Same',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Thank you for the update. Dr. Sharma will review your case again.\nTo book a review slot, type remind.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_worse',
        name: 'Feeling Worse',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Sorry to hear that. Dr. Sharma will be notified for follow-up.\nType remind to book a quick review appointment.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_remind',
        name: 'Review Reminder',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Reminder: Your review with Dr. Sharma is due tomorrow, Oct 25.\nWould you like to confirm a slot?\n1️⃣ Confirm → yes\n2️⃣ Reschedule → no'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_yes',
        name: 'Confirm Review',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Your review slot has been confirmed. See you tomorrow!'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_no',
        name: 'Reschedule Review',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'Please share your preferred date and time to reschedule your appointment.'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        messageId: 'msg_help',
        name: 'Help Menu',
        type: 'standard_text',
        status: 'published',
        contentPayload: {
          body: 'I can assist you with:\n1️⃣ Booking → book\n2️⃣ Lab Tests → lab\n3️⃣ Pharmacy Orders → meds\n4️⃣ Reports → rep'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Enhanced triggers with button support
    this.triggers = [
      // Button-based triggers for interactive messages
      {
        triggerId: 'trigger_book_appointment',
        triggerType: 'button_click',
        triggerValue: 'btn_book_appointment',
        nextAction: 'send_message',
        targetId: 'msg_book_interactive',
        messageId: 'msg_book_interactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_lab_tests',
        triggerType: 'button_click',
        triggerValue: 'btn_lab_tests',
        nextAction: 'send_message',
        targetId: 'msg_lab_interactive',
        messageId: 'msg_lab_interactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_emergency',
        triggerType: 'button_click',
        triggerValue: 'btn_emergency',
        nextAction: 'send_message',
        targetId: 'msg_emergency',
        messageId: 'msg_emergency',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_general_checkup',
        triggerType: 'button_click',
        triggerValue: 'btn_general_checkup',
        nextAction: 'send_message',
        targetId: 'msg_doctor_selection',
        messageId: 'msg_doctor_selection',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_dr_sharma',
        triggerType: 'list_selection',
        triggerValue: 'dr_sharma',
        nextAction: 'send_message',
        targetId: 'msg_sharma_slots_interactive',
        messageId: 'msg_sharma_slots_interactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_slot_930',
        triggerType: 'button_click',
        triggerValue: 'btn_slot_930',
        nextAction: 'send_message',
        targetId: 'msg_confirm_appointment',
        messageId: 'msg_confirm_appointment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_confirm_pay',
        triggerType: 'button_click',
        triggerValue: 'btn_confirm_pay',
        nextAction: 'send_message',
        targetId: 'msg_payment_link',
        messageId: 'msg_payment_link',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_payment_done',
        triggerType: 'button_click',
        triggerValue: 'btn_payment_done',
        nextAction: 'send_message',
        targetId: 'msg_appointment_confirmed',
        messageId: 'msg_appointment_confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_main_menu',
        triggerType: 'button_click',
        triggerValue: 'btn_main_menu',
        nextAction: 'send_message',
        targetId: 'msg_welcome_interactive',
        messageId: 'msg_welcome_interactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Keyword-based triggers (existing)
      {
        triggerId: 'trigger_hi',
        triggerType: 'keyword_match',
        triggerValue: ['hi', 'hello', 'hey'],
        nextAction: 'send_message',
        targetId: 'msg_hi',
        messageId: 'msg_hi',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_book',
        triggerType: 'keyword_match',
        triggerValue: ['book'],
        nextAction: 'send_message',
        targetId: 'msg_book',
        messageId: 'msg_book',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_sharma',
        triggerType: 'keyword_match',
        triggerValue: ['sharma'],
        nextAction: 'send_message',
        targetId: 'msg_sharma',
        messageId: 'msg_sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_930',
        triggerType: 'keyword_match',
        triggerValue: ['930'],
        nextAction: 'send_message',
        targetId: 'msg_sharma930',
        messageId: 'msg_sharma930',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_4pm',
        triggerType: 'keyword_match',
        triggerValue: ['4pm'],
        nextAction: 'send_message',
        targetId: 'msg_sharma4pm',
        messageId: 'msg_sharma4pm',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_donepay',
        triggerType: 'keyword_match',
        triggerValue: ['donepay'],
        nextAction: 'send_message',
        targetId: 'msg_donepay',
        messageId: 'msg_donepay',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_lab',
        triggerType: 'keyword_match',
        triggerValue: ['lab'],
        nextAction: 'send_message',
        targetId: 'msg_lab',
        messageId: 'msg_lab',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_lpay',
        triggerType: 'keyword_match',
        triggerValue: ['lpay'],
        nextAction: 'send_message',
        targetId: 'msg_labpay',
        messageId: 'msg_labpay',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_labrep',
        triggerType: 'keyword_match',
        triggerValue: ['lrep'],
        nextAction: 'send_message',
        targetId: 'msg_labrep',
        messageId: 'msg_labrep',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_meds',
        triggerType: 'keyword_match',
        triggerValue: ['meds'],
        nextAction: 'send_message',
        targetId: 'msg_meds',
        messageId: 'msg_meds',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_confirm',
        triggerType: 'keyword_match',
        triggerValue: ['confirm'],
        nextAction: 'send_message',
        targetId: 'msg_ok',
        messageId: 'msg_ok',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_medpay',
        triggerType: 'keyword_match',
        triggerValue: ['medpay'],
        nextAction: 'send_message',
        targetId: 'msg_medpay',
        messageId: 'msg_medpay',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_check',
        triggerType: 'keyword_match',
        triggerValue: ['check'],
        nextAction: 'send_message',
        targetId: 'msg_check',
        messageId: 'msg_check',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_better',
        triggerType: 'keyword_match',
        triggerValue: ['better'],
        nextAction: 'send_message',
        targetId: 'msg_better',
        messageId: 'msg_better',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_same',
        triggerType: 'keyword_match',
        triggerValue: ['same'],
        nextAction: 'send_message',
        targetId: 'msg_same',
        messageId: 'msg_same',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_worse',
        triggerType: 'keyword_match',
        triggerValue: ['worse'],
        nextAction: 'send_message',
        targetId: 'msg_worse',
        messageId: 'msg_worse',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_remind',
        triggerType: 'keyword_match',
        triggerValue: ['remind'],
        nextAction: 'send_message',
        targetId: 'msg_remind',
        messageId: 'msg_remind',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_yes',
        triggerType: 'keyword_match',
        triggerValue: ['yes'],
        nextAction: 'send_message',
        targetId: 'msg_yes',
        messageId: 'msg_yes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_no',
        triggerType: 'keyword_match',
        triggerValue: ['no'],
        nextAction: 'send_message',
        targetId: 'msg_no',
        messageId: 'msg_no',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        triggerId: 'trigger_help',
        triggerType: 'keyword_match',
        triggerValue: ['help'],
        nextAction: 'send_message',
        targetId: 'msg_help',
        messageId: 'msg_help',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Get all published messages
  getPublishedMessages() {
    return this.messages.filter(msg => msg.status === 'published');
  }

  // Get message by ID
  getMessageById(messageId) {
    return this.messages.find(msg => msg.messageId === messageId);
  }

  // Find matching triggers for a message
  findMatchingTriggers(messageText) {
    const normalizedText = messageText.toLowerCase().trim();
    
    return this.triggers.filter(trigger => {
      if (trigger.triggerType === 'keyword_match') {
        const keywords = Array.isArray(trigger.triggerValue) 
          ? trigger.triggerValue 
          : [trigger.triggerValue];
        
        return keywords.some(keyword => 
          normalizedText.includes(keyword.toLowerCase())
        );
      }
      return false;
    });
  }

  // Find matching triggers for button interactions
  findButtonTrigger(buttonId) {
    return this.triggers.find(trigger => 
      trigger.triggerType === 'button_click' && 
      trigger.triggerValue === buttonId
    );
  }

  // Find matching triggers for list selections
  findListTrigger(listItemId) {
    return this.triggers.find(trigger => 
      trigger.triggerType === 'list_selection' && 
      trigger.triggerValue === listItemId
    );
  }

  // Process interactive message response
  processInteractiveResponse(interactiveData) {
    let matchingTrigger = null;
    
    if (interactiveData.type === 'button_reply') {
      matchingTrigger = this.findButtonTrigger(interactiveData.button_reply.id);
    } else if (interactiveData.type === 'list_reply') {
      matchingTrigger = this.findListTrigger(interactiveData.list_reply.id);
    }
    
    if (matchingTrigger) {
      console.log(`🎯 Found interactive trigger: ${matchingTrigger.triggerId} for ${interactiveData.type}`);
      return {
        trigger: matchingTrigger,
        nextMessage: this.getMessageById(matchingTrigger.targetId)
      };
    }
    
    console.log(`📝 No matching trigger found for interactive response:`, interactiveData);
    return null;
  }

  // Get button information from a message
  getMessageButtons(messageId) {
    const message = this.getMessageById(messageId);
    if (!message || !message.contentPayload.buttons) {
      return [];
    }
    
    return message.contentPayload.buttons.map(button => ({
      buttonId: button.buttonId,
      title: button.title,
      triggerId: button.triggerId,
      nextAction: button.nextAction,
      targetMessageId: button.targetMessageId
    }));
  }

  // Get list options from a message
  getMessageListOptions(messageId) {
    const message = this.getMessageById(messageId);
    if (!message || !message.contentPayload.sections) {
      return [];
    }
    
    const options = [];
    message.contentPayload.sections.forEach(section => {
      section.rows.forEach(row => {
        options.push({
          rowId: row.rowId,
          title: row.title,
          description: row.description,
          triggerId: row.triggerId,
          nextAction: row.nextAction,
          targetMessageId: row.targetMessageId
        });
      });
    });
    
    return options;
  }

  // Send message using WhatsApp API
  async sendLibraryMessage(messageEntry, recipientPhone) {
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0';

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      throw new Error('Missing WhatsApp API credentials');
    }

    const apiUrl = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    
    let messagePayload;

    switch (messageEntry.type) {
      case 'standard_text':
        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: messageEntry.contentPayload.body
          }
        };
        break;

      case 'interactive_button':
        const payload = messageEntry.contentPayload;
        const interactive = {
          type: 'button',
          body: { text: payload.body || '' },
          action: {
            buttons: (payload.buttons || []).slice(0, 3).map(btn => ({
              type: 'reply',
              reply: {
                id: btn.buttonId || btn.id,
                title: btn.title
              }
            }))
          }
        };

        if (payload.header) {
          interactive.header = { type: 'text', text: payload.header };
        }
        if (payload.footer) {
          interactive.footer = { text: payload.footer };
        }

        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'interactive',
          interactive
        };
        break;

      case 'interactive_list':
        const listPayload = messageEntry.contentPayload;
        const listInteractive = {
          type: 'list',
          body: { text: listPayload.body || '' },
          action: {
            button: listPayload.buttonText || 'View Options',
            sections: (listPayload.sections || []).map(section => ({
              title: section.title,
              rows: (section.rows || []).map(row => ({
                id: row.rowId || row.id,
                title: row.title,
                description: row.description
              }))
            }))
          }
        };

        if (listPayload.header) {
          listInteractive.header = { type: 'text', text: listPayload.header };
        }
        if (listPayload.footer) {
          listInteractive.footer = { text: listPayload.footer };
        }

        messagePayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'interactive',
          interactive: listInteractive
        };
        break;

      default:
        throw new Error(`Unsupported message type: ${messageEntry.type}`);
    }

    try {
      console.log('📤 Sending message via WhatsApp API:', {
        type: messageEntry.type,
        to: recipientPhone,
        messageId: messageEntry.messageId
      });

      const response = await axios.post(apiUrl, messagePayload, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Message sent successfully:', response.data);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('❌ Failed to send message:', error.response?.data || error.message);
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Add a new message (for API integration)
  addMessage(messageData) {
    const newMessage = {
      messageId: `msg_${Date.now()}`,
      ...messageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.messages.push(newMessage);
    return newMessage;
  }

  // Add a new trigger (for API integration)
  addTrigger(triggerData) {
    const newTrigger = {
      triggerId: `trigger_${Date.now()}`,
      ...triggerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.triggers.push(newTrigger);
    return newTrigger;
  }
}

module.exports = new MessageLibraryService();
