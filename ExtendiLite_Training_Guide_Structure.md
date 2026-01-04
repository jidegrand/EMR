# ExtendiLite EMR - Training Guide Structure Proposal

**Status:** DRAFT - Structure Approved  
**Date:** January 2026  
**Next Step:** Generate full documentation with screenshots

---

## Recommended Approach: Task-Based Modules

| Module | Content | Est. Time |
|--------|---------|-----------|
| **1. Getting Started** | Login, dashboard overview, navigation, logout | 10 min |
| **2. Managing Patients** | Queue, lookup, registration, patient summary | 15 min |
| **3. Clinical Documentation** | SOAP notes, voice dictation, ICD-10 search | 20 min |
| **4. Orders & Prescriptions** | e-Prescribing, lab orders, referrals | 15 min |
| **5. Communication** | Secure messaging, appointment scheduling | 10 min |
| **6. Telemedicine** | Starting video calls, PiP mode, documentation | 10 min |
| **7. Records & History** | Record viewer, encounter history, exports | 10 min |
| **8. Tips & Troubleshooting** | Shortcuts, common issues, FAQ | 5 min |

**Total Estimated Training Time:** ~95 minutes

---

## Module Template Structure

Each module follows this consistent format:

```
MODULE X: [Title]
├── Learning Objectives (3-5 bullet points)
├── Prerequisites (what to complete first)
│
├── Section X.1: [Subtopic]
│   ├── Overview paragraph
│   ├── Step-by-step instructions
│   │   ├── Step 1: [Action] + Screenshot
│   │   ├── Step 2: [Action] + Screenshot
│   │   └── Step 3: [Action] + Screenshot
│   ├── Pro Tips callout box
│   └── Common Mistakes to Avoid
│
├── Section X.2: [Subtopic]
│   └── (same structure)
│
├── Practice Exercise
│   └── Hands-on scenario to try
│
├── Knowledge Check
│   └── 3-5 quiz questions
│
└── Quick Reference Card
    └── 1-page summary of key actions
```

---

## Screenshot Strategy

| Element | Purpose | Example |
|---------|---------|---------|
| **Full Screen** | Show context/location | Dashboard overview |
| **Focused Area** | Highlight specific UI | Login form only |
| **Annotated** | Guide attention | Arrows pointing to buttons |
| **Numbered Steps** | Sequential actions | 1→2→3 on form fields |
| **Before/After** | Show results | Queue before/after adding patient |
| **Callout Boxes** | Highlight important areas | Red box around "Sign & Lock" |

---

## Detailed Table of Contents

```
EXTENDILITE EMR TRAINING GUIDE
Version 1.0 | January 2026

INTRODUCTION
  • About This Guide
  • System Requirements
  • Getting Help & Support

MODULE 1: GETTING STARTED
  1.1 Logging In
      - Accessing the System
      - Entering Credentials
      - Two-Factor Authentication (2FA)
        • Understanding 2FA Methods (TOTP, SMS, Email)
        • Using Authenticator Apps (Google/Microsoft Authenticator)
        • Entering the 6-Digit Verification Code
        • "Remember This Device" Option
        • Troubleshooting 2FA Issues
  1.2 Dashboard Overview
      - Header Components
      - Navigation Menu
      - Patient Queue
      - Quick Actions
  1.3 Security Features
      - Session Timeout Warning
      - Re-Authentication for PHI
      - Logging Out Safely

MODULE 2: PATIENT MANAGEMENT
  2.1 Understanding the Patient Queue
      - Triage Score Colors
      - Sorting & Filtering
      - Patient Summary Panel
  2.2 Registering New Patients
      - Demographics Tab
      - Contact Information Tab
      - Insurance Tab
      - Medical History Tab
      - Consent & Signature Tab
  2.3 Finding Existing Patients
      - Search by Name
      - Search by MRN
      - Search by Date of Birth
      - Advanced Filters

MODULE 3: CLINICAL DOCUMENTATION
  3.1 Starting an Encounter
      - From Queue
      - From Patient Lookup
  3.2 SOAP Note Documentation
      - Subjective Tab
        • Chief Complaint
        • History of Present Illness
        • Review of Systems
        • Past Medical History
      - Objective Tab
        • Importing Vitals
        • Physical Exam Documentation
      - Assessment Tab
        • ICD-10 Diagnosis Search
        • Adding Multiple Diagnoses
      - Plan Tab
        • Treatment Notes
        • Adding Orders
        • Patient Education
        • Follow-up Instructions
  3.3 Voice Dictation
      - Enabling Dictation
      - Using Field Microphones
      - Editing Transcribed Text
  3.4 Completing the Encounter
      - Reviewing Documentation
      - Electronic Signature
      - Locking the Record

MODULE 4: ORDERS & PRESCRIPTIONS
  4.1 E-Prescribing
      - Searching Medications
      - Drug Interaction Alerts
      - Entering Prescription Details
      - Selecting Pharmacy
      - Transmitting Prescriptions
      - Tracking Prescription Status
  4.2 Lab Orders
      - Selecting Test Categories
      - Choosing Specific Tests
      - Setting Priority
      - Reviewing Results
      - Critical Value Alerts
  4.3 Referrals
      - Creating a Referral
      - Selecting Specialists
      - Tracking Referral Status

MODULE 5: COMMUNICATION
  5.1 Secure Messaging
      - Inbox Navigation
      - Composing Messages
      - Message Types
      - Attachments
  5.2 Appointment Scheduling
      - Calendar Views
      - Creating Appointments
      - Appointment Types
      - Managing Schedule

MODULE 6: TELEMEDICINE
  6.1 Starting a Video Visit
      - From Patient Queue
      - Technical Requirements
  6.2 During the Visit
      - Video Controls
      - Picture-in-Picture Mode
      - Screen Sharing
  6.3 Documenting Video Visits
      - SOAP Notes for Telehealth
      - Visit Type Selection

MODULE 7: RECORDS & HISTORY
  7.1 Record Viewer
      - Accessing Past Encounters
      - Viewing Locked Records
  7.2 Exporting & Printing
      - Re-Authentication Process
      - Export Formats
      - Print Options

MODULE 8: TIPS & TROUBLESHOOTING
  8.1 Keyboard Shortcuts
  8.2 Time-Saving Tips
  8.3 Common Issues & Solutions
  8.4 Frequently Asked Questions

APPENDICES
  A. Glossary of Terms
  B. HIPAA Compliance Reminders
  C. Quick Reference Cards (printable)
  D. Contact Information
```

---

## Design Specifications

| Element | Specification |
|---------|---------------|
| **Format** | Word (.docx) + PDF for distribution |
| **Page Size** | Letter (8.5" x 11") |
| **Screenshots** | 300 DPI, max 6" wide, bordered |
| **Callout Style** | Red circles/arrows for emphasis |
| **Color Coding** | Green = success, Yellow = warning, Red = caution |
| **Fonts** | Arial 11pt body, 14pt headers |
| **Length** | ~50-70 pages with screenshots |

---

## Quick Reference Cards (Bonus Deliverables)

Single-page printable cards for:
- [ ] Login & Logout
- [ ] SOAP Documentation Checklist
- [ ] E-Prescribing Quick Steps
- [ ] Lab Orders Quick Steps
- [ ] Keyboard Shortcuts

---

## Alternative Approaches Available

1. **Full Training Guide** (~50-70 pages, comprehensive)
2. **Quick Start Guide only** (~10 pages, essentials)
3. **Role-specific guides** (separate docs per role)
4. **Hybrid** (Quick Start + detailed modules)

---

## Notes for Implementation

- Screenshots will require running application or annotated mockups
- Consider creating both print-friendly and digital versions
- Video tutorials could complement written documentation
- Include demo credentials for practice environment

---

*Saved for future implementation*
