# ExtendiLite EMR - Process Flows Documentation

**Version:** 1.0.0.2  
**Date:** January 2026  
**Classification:** CONFIDENTIAL

---

## 1. Executive Summary

This document provides detailed process flow specifications for all user workflows within the ExtendiLite Electronic Medical Records (EMR) system. Each process is documented with step-by-step instructions, decision points, and expected outcomes to ensure consistent system usage across all clinical staff.

---

## 2. Authentication Processes

### 2.1 Initial Login Process

**Purpose:** Secure authentication of clinical staff to access the EMR system.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Navigate to login page | Display login form with email/password fields | 2 |
| 2 | Enter credentials | Validate input format | 3 |
| 3 | Click "Sign In" | Authenticate against user database | 4 or 5 |
| 4 | Success | Check if 2FA is enabled for user | 6 or 7 |
| 5 | Failure | Display error, increment attempt counter | 2 (max 3 attempts) |
| 6 | 2FA Enabled | Redirect to Two-Factor Authentication screen | See 2.2 |
| 7 | 2FA Disabled | Generate session, redirect to Dashboard | Complete |

**Validation Rules:**
- Email must be valid format (user@domain.com)
- Password minimum 8 characters
- Account lockout after 3 failed attempts (15-minute cooldown)

### 2.2 Two-Factor Authentication (2FA) Process

**Purpose:** Additional security layer to verify user identity using TOTP, SMS, or Email codes.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Display 2FA screen | Show 6-digit code input, method indicator | 2 |
| 2 | User enters 6-digit code | Validate code format | 3 |
| 3 | System verifies code | Check against TOTP/SMS/Email code | 4 or 5 |
| 4 | Code Valid | Log audit event, generate session | 6 |
| 5 | Code Invalid | Display error, increment attempt counter | 2 (max 3) |
| 6 | Check "Remember Device" | Store device token (30 days) if checked | 7 |
| 7 | Authentication Complete | Redirect to Dashboard | Complete |

**2FA Methods Supported:**
- **TOTP (Authenticator App):** Google Authenticator, Microsoft Authenticator, Authy
- **SMS:** 6-digit code sent to registered phone number
- **Email:** 6-digit code sent to registered email address

**Security Features:**
- Code expires after 30 seconds (TOTP) or 5 minutes (SMS/Email)
- Maximum 3 failed attempts before 15-minute lockout
- "Remember this device" option for trusted devices (30 days)
- Audit logging of all 2FA attempts

### 2.3 Session Timeout Process

**Purpose:** Automatically secure unattended workstations per HIPAA requirements.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | 14 minutes of inactivity | Display 60-second warning modal | 2 or 3 |
| 2 | User clicks "Stay Logged In" | Reset inactivity timer to 15 minutes | Monitor |
| 3 | No user response in 60 seconds | Auto-logout, clear session data | 4 |
| 4 | Session terminated | Redirect to login page | Complete |

**Activity Detection:** Mouse movement, keyboard input, touch events, scroll events.

### 2.4 Re-Authentication Process (PHI Access)

**Purpose:** Additional security verification before viewing, printing, or exporting Protected Health Information.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | User requests sensitive action | Display re-authentication modal | 2 |
| 2 | Enter current password | Validate credentials | 3 or 4 |
| 3 | Success | Log audit event, proceed with action | Complete |
| 4 | Failure | Display error, allow retry (max 3) | 2 or 5 |
| 5 | Max attempts exceeded | Cancel action, alert security team | Complete |

**Triggers:** View patient record details, Print documents, Export/Download data.

### 2.5 Logout Process

**Purpose:** Secure session termination with confirmation.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Click logout button | Display confirmation modal | 2 or 3 |
| 2 | User confirms logout | Clear session, log audit event | 4 |
| 3 | User cancels | Close modal, remain logged in | Monitor |
| 4 | Session terminated | Redirect to login page | Complete |

---

## 3. Patient Management Processes

### 3.1 Patient Queue Management

**Purpose:** Efficiently manage daily patient workflow with priority-based triage.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | View Dashboard | Display patient queue sorted by triage score | 2 |
| 2 | Review patient list | Show name, chief complaint, wait time, triage | 3 |
| 3 | Click patient row | Expand summary panel with vitals/history | 4 or 5 |
| 4 | Click "Start Encounter" | Navigate to encounter screen | Complete |
| 5 | Click "Start Video Call" | Initialize telemedicine session | Complete |

**Triage Score Calculation:**
- Score 1-3 (Green): Routine, non-urgent
- Score 4-6 (Yellow): Moderate urgency
- Score 7-10 (Red): High priority, immediate attention

### 3.2 Patient Registration Process

**Purpose:** Capture complete patient demographic, insurance, and medical information.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Click "Add Patient" | Open 5-tab registration modal | 2 |
| 2 | Complete Demographics tab | Validate required fields | 3 |
| 3 | Complete Contact tab | Validate phone/email formats | 4 |
| 4 | Complete Insurance tab | Verify policy information | 5 |
| 5 | Complete Medical History tab | Record allergies, conditions, meds | 6 |
| 6 | Complete Consent tab | Capture electronic signature | 7 |
| 7 | Click "Save" | Create patient record, generate MRN | Complete |

**Required Fields:** First name, Last name, Date of birth, Gender, Primary phone, Emergency contact.

### 3.3 Patient Lookup Process

**Purpose:** Quickly locate existing patient records.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Navigate to Patient Lookup | Display search interface | 2 |
| 2 | Enter search criteria | Filter by name, DOB, MRN, or phone | 3 |
| 3 | View results | Display matching patients in table | 4 |
| 4 | Click patient name | Open patient summary view | 5 |
| 5 | Select action | View details, Start encounter, View history | Complete |

---

## 4. Clinical Documentation Processes

### 4.1 SOAP Note Documentation Process

**Purpose:** Structured clinical documentation following SOAP methodology.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Start encounter | Load SOAP tabs interface | 2 |
| 2 | **Subjective Tab** | Document chief complaint, HPI, ROS, PMH | 3 |
| 3 | **Objective Tab** | Record vitals, physical exam findings | 4 |
| 4 | **Assessment Tab** | Search/select ICD-10 diagnosis codes | 5 |
| 5 | **Plan Tab** | Document treatment, orders, follow-up | 6 |
| 6 | Review all tabs | Verify completeness | 7 |
| 7 | Click "Sign & Lock" | Capture e-signature, finalize record | Complete |

### 4.2 Voice Dictation Process

**Purpose:** Accelerate documentation through speech-to-text transcription.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Enable global dictation toggle | Activate speech recognition | 2 |
| 2 | Click microphone icon on field | Begin recording for that field | 3 |
| 3 | Speak documentation | Real-time transcription display | 4 |
| 4 | Click microphone to stop | Finalize transcribed text | 5 |
| 5 | Review and edit | Manual corrections as needed | Complete |

**Supported Fields:** Chief Complaint, HPI, Physical Exam, Assessment notes, Plan notes.

### 4.3 Encounter Completion Process

**Purpose:** Properly finalize and lock clinical encounters.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Complete all SOAP sections | Enable "Sign & Lock" button | 2 |
| 2 | Click "Sign & Lock" | Display e-signature capture modal | 3 |
| 3 | Sign with mouse/touch | Capture signature image | 4 |
| 4 | Confirm signature | Lock encounter, timestamp, log audit | Complete |

**Post-Completion:** Record becomes read-only, accessible via Record Viewer.

---

## 5. E-Prescribing Process

### 5.1 New Prescription Creation

**Purpose:** Electronic prescription generation and pharmacy transmission.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Click "Add Prescription" in Plan tab | Open prescription modal | 2 |
| 2 | Search medication database | Display matching drugs with strengths | 3 |
| 3 | Select medication | Load default dosing options | 4 |
| 4 | System checks interactions | Alert if allergies/conflicts found | 5 or 6 |
| 5 | Acknowledge/modify if alerts | Update prescription details | 6 |
| 6 | Enter sig, quantity, refills | Complete prescription details | 7 |
| 7 | Select pharmacy | Choose from patient's preferred list | 8 |
| 8 | Click "Transmit" | Send electronically to pharmacy | Complete |

### 5.2 Prescription Status Tracking

**Purpose:** Monitor prescription lifecycle from creation to dispensing.

| Status | Description | Actions Available |
|--------|-------------|-------------------|
| Pending | Awaiting pharmacy processing | Cancel, Resend |
| Dispensed | Pharmacy has filled | View details |
| Requires Auth | Prior authorization needed | Request auth |
| Cancelled | Prescription voided | None |

---

## 6. Lab Orders Process

### 6.1 Lab Order Creation

**Purpose:** Electronic laboratory test ordering.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Click "Add Lab Order" in Plan tab | Open lab orders modal | 2 |
| 2 | Select test category | Display available tests | 3 |
| 3 | Check desired tests | Add to order panel | 4 |
| 4 | Set priority (Routine/Stat) | Update order priority | 5 |
| 5 | Select lab facility | Choose from available locations | 6 |
| 6 | Add clinical notes | Document reason for tests | 7 |
| 7 | Click "Submit Order" | Transmit to laboratory | Complete |

### 6.2 Lab Results Review

**Purpose:** Review and act on returned laboratory results.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Navigate to Lab Orders screen | Display orders with status | 2 |
| 2 | Click "Resulted" order | Expand results panel | 3 |
| 3 | Review values | Display with reference ranges | 4 |
| 4 | Note HIGH/LOW/CRITICAL flags | Highlighted abnormal values | 5 |
| 5 | Document action taken | Add follow-up notes | Complete |

---

## 7. Referral Process

### 7.1 Referral Creation

**Purpose:** Specialist referral generation and tracking.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Click "Add Referral" in Plan tab | Open referral modal | 2 |
| 2 | Select specialty | Display specialist providers | 3 |
| 3 | Choose specific provider | Load provider details | 4 |
| 4 | Set urgency level | Routine/Urgent/Emergent | 5 |
| 5 | Enter reason for referral | Clinical justification | 6 |
| 6 | Add supporting notes | Additional context | 7 |
| 7 | Click "Send Referral" | Transmit electronically | Complete |

### 7.2 Referral Status Tracking

| Status | Description | Next Actions |
|--------|-------------|--------------|
| Pending | Awaiting specialist response | Follow up |
| Sent | Transmitted to specialist | Monitor |
| Scheduled | Appointment confirmed | View date |
| Completed | Visit occurred | Review notes |

---

## 8. Messaging Process

### 8.1 Secure Message Composition

**Purpose:** HIPAA-compliant internal and external communication.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Navigate to Messages | Display inbox/folders | 2 |
| 2 | Click "Compose" | Open new message modal | 3 |
| 3 | Select message type | Patient/Provider/Department/Pharmacy | 4 |
| 4 | Choose recipient(s) | Search and select | 5 |
| 5 | Set priority | Normal/High/Urgent | 6 |
| 6 | Enter subject and body | Compose message content | 7 |
| 7 | Attach files (optional) | Add documents/images | 8 |
| 8 | Click "Send" | Deliver and log message | Complete |

---

## 9. Appointment Scheduling Process

### 9.1 Appointment Creation

**Purpose:** Schedule patient visits and manage calendar.

| Step | Action | System Response | Next Step |
|------|--------|-----------------|-----------|
| 1 | Navigate to Appointments | Display calendar view | 2 |
| 2 | Select date/time slot | Open scheduling modal | 3 |
| 3 | Search/select patient | Load patient info | 4 |
| 4 | Choose appointment type | Set duration automatically | 5 |
| 5 | Add notes (optional) | Document special requirements | 6 |
| 6 | Click "Schedule" | Create appointment, send confirmation | Complete |

**Appointment Types:**
| Type | Duration | Color |
|------|----------|-------|
| Office Visit | 30 min | Blue |
| Follow-Up | 15 min | Teal |
| New Patient | 45 min | Violet |
| Telemedicine | 20 min | Emerald |
| Procedure | 60 min | Amber |

---

## 10. Audit and Compliance

### 10.1 Audit Log Generation

All processes automatically generate audit entries containing:

| Field | Description |
|-------|-------------|
| User ID | Authenticated user identifier |
| Workstation ID | Device/terminal identifier |
| Timestamp | UTC date/time of action |
| Action Type | View, Create, Update, Delete, Print, Export |
| Patient ID | Affected patient (if applicable) |
| IP Address | Network location |
| Result | Success/Failure |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0.1 | Jan 2026 | ExtendiLite Team | Initial release |
| 1.0.0.2 | Jan 2026 | ExtendiLite Team | Added Two-Factor Authentication (2FA) process |

---

*© 2026 ExtendiLite Health Technologies Inc. All rights reserved.*
