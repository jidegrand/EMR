# ExtendiLite EMR - Flow Diagrams Documentation

**Version:** 1.0.0.2  
**Date:** January 2026  
**Classification:** CONFIDENTIAL

---

## 1. Overview

This document provides visual flow diagrams for all major workflows within the ExtendiLite EMR system. Diagrams are presented in Mermaid format for easy rendering and modification.

---

## 2. Authentication Flows

### 2.1 Login Flow

```mermaid
flowchart TD
    A[Start] --> B[Navigate to Login Page]
    B --> C[Enter Email & Password]
    C --> D{Validate Credentials}
    D -->|Valid| E{2FA Enabled?}
    D -->|Invalid| F{Attempts < 3?}
    F -->|Yes| G[Show Error Message]
    G --> C
    F -->|No| H[Lock Account 15 min]
    H --> I[End - Locked]
    E -->|Yes| J[Redirect to 2FA Screen]
    J --> K[See 2FA Flow]
    E -->|No| L[Generate Session Token]
    L --> M[Load User Profile]
    M --> N[Redirect to Dashboard]
    N --> O[End - Success]
    
    style A fill:#10B981,color:#fff
    style O fill:#10B981,color:#fff
    style I fill:#EF4444,color:#fff
    style D fill:#F59E0B,color:#fff
    style E fill:#8B5CF6,color:#fff
    style F fill:#F59E0B,color:#fff
```

### 2.2 Two-Factor Authentication (2FA) Flow

```mermaid
flowchart TD
    A[2FA Screen Displayed] --> B[Show Method Indicator]
    B --> C{Method Type?}
    C -->|TOTP| D[Display: Enter code from authenticator app]
    C -->|SMS| E[Send SMS to phone]
    C -->|Email| F[Send code to email]
    D --> G[User Enters 6-Digit Code]
    E --> G
    F --> G
    G --> H{Validate Code}
    H -->|Valid| I[Log Audit Event]
    I --> J{Remember Device?}
    J -->|Yes| K[Store Device Token 30 days]
    J -->|No| L[Continue]
    K --> L
    L --> M[Generate Session]
    M --> N[Redirect to Dashboard]
    N --> O[End - Success]
    H -->|Invalid| P{Attempts < 3?}
    P -->|Yes| Q[Show Error]
    Q --> R[Clear Code Input]
    R --> G
    P -->|No| S[Lock Account 15 min]
    S --> T[Redirect to Login]
    T --> U[End - Locked]
    
    style A fill:#8B5CF6,color:#fff
    style O fill:#10B981,color:#fff
    style U fill:#EF4444,color:#fff
    style H fill:#F59E0B,color:#fff
    style J fill:#F59E0B,color:#fff
```

**2FA Security Features:**
- TOTP codes expire every 30 seconds
- SMS/Email codes expire after 5 minutes  
- Maximum 3 failed attempts before lockout
- Device can be remembered for 30 days
- All attempts logged for audit

### 2.3 Session Timeout Flow

```mermaid
flowchart TD
    A[User Active] --> B[Monitor Activity]
    B --> C{Activity Detected?}
    C -->|Yes| D[Reset Timer to 15 min]
    D --> B
    C -->|No| E{14 min Elapsed?}
    E -->|No| B
    E -->|Yes| F[Show Warning Modal]
    F --> G{User Response in 60s?}
    G -->|Stay Logged In| D
    G -->|No Response| H[Clear Session Data]
    H --> I[Redirect to Login]
    I --> J[End - Timeout]
    
    style A fill:#3B82F6,color:#fff
    style J fill:#EF4444,color:#fff
    style F fill:#F59E0B,color:#fff
```

### 2.4 Re-Authentication Flow (PHI Access)

```mermaid
flowchart TD
    A[Request Sensitive Action] --> B[Display Re-Auth Modal]
    B --> C[Enter Current Password]
    C --> D{Password Correct?}
    D -->|Yes| E[Log Audit Event]
    E --> F[Proceed with Action]
    F --> G[End - Success]
    D -->|No| H{Attempts < 3?}
    H -->|Yes| I[Show Error]
    I --> C
    H -->|No| J[Cancel Action]
    J --> K[Alert Security Team]
    K --> L[End - Blocked]
    
    style A fill:#8B5CF6,color:#fff
    style G fill:#10B981,color:#fff
    style L fill:#EF4444,color:#fff
```

### 2.4 Logout Flow

```mermaid
flowchart TD
    A[Click Logout] --> B[Show Confirmation Modal]
    B --> C{User Confirms?}
    C -->|Yes| D[Clear Session Data]
    D --> E[Log Audit Event]
    E --> F[Redirect to Login]
    F --> G[End - Logged Out]
    C -->|Cancel| H[Close Modal]
    H --> I[Continue Session]
    I --> J[End - Cancelled]
    
    style A fill:#6366F1,color:#fff
    style G fill:#10B981,color:#fff
    style J fill:#94A3B8,color:#fff
```

---

## 3. Patient Management Flows

### 3.1 Patient Queue Flow

```mermaid
flowchart TD
    A[Dashboard Load] --> B[Fetch Patient Queue]
    B --> C[Sort by Triage Score]
    C --> D[Display Patient List]
    D --> E{User Action?}
    E -->|Click Patient| F[Expand Summary Panel]
    F --> G{Next Action?}
    G -->|Start Encounter| H[Navigate to Encounter]
    G -->|Video Call| I[Initialize Telemedicine]
    G -->|View History| J[Open Record Viewer]
    E -->|Refresh| B
    E -->|Search| K[Filter Results]
    K --> D
    H --> L[End - Encounter Started]
    I --> M[End - Video Started]
    J --> N[End - Viewing Records]
    
    style A fill:#0D9488,color:#fff
    style L fill:#10B981,color:#fff
    style M fill:#06B6D4,color:#fff
    style N fill:#8B5CF6,color:#fff
```

### 3.2 Patient Registration Flow

```mermaid
flowchart TD
    A[Click Add Patient] --> B[Open Registration Modal]
    B --> C[Tab 1: Demographics]
    C --> D{Valid?}
    D -->|No| E[Show Errors]
    E --> C
    D -->|Yes| F[Tab 2: Contact Info]
    F --> G{Valid?}
    G -->|No| H[Show Errors]
    H --> F
    G -->|Yes| I[Tab 3: Insurance]
    I --> J[Tab 4: Medical History]
    J --> K[Tab 5: Consent]
    K --> L[Capture E-Signature]
    L --> M[Click Save]
    M --> N[Generate MRN]
    N --> O[Create Patient Record]
    O --> P[End - Patient Created]
    
    style A fill:#0D9488,color:#fff
    style P fill:#10B981,color:#fff
    style D fill:#F59E0B,color:#fff
    style G fill:#F59E0B,color:#fff
```

### 3.3 Patient Lookup Flow

```mermaid
flowchart TD
    A[Navigate to Lookup] --> B[Display Search Form]
    B --> C[Enter Search Criteria]
    C --> D{Search Type?}
    D -->|Name| E[Search by Name]
    D -->|MRN| F[Search by MRN]
    D -->|DOB| G[Search by Date of Birth]
    D -->|Phone| H[Search by Phone]
    E --> I[Query Database]
    F --> I
    G --> I
    H --> I
    I --> J{Results Found?}
    J -->|Yes| K[Display Results Table]
    J -->|No| L[Show No Results Message]
    L --> C
    K --> M[Click Patient Row]
    M --> N[Open Patient View]
    N --> O[End - Patient Found]
    
    style A fill:#3B82F6,color:#fff
    style O fill:#10B981,color:#fff
    style J fill:#F59E0B,color:#fff
```

---

## 4. Clinical Documentation Flows

### 4.1 SOAP Documentation Flow

```mermaid
flowchart TD
    A[Start Encounter] --> B[Load SOAP Interface]
    B --> C[Subjective Tab]
    C --> D[Chief Complaint]
    D --> E[HPI - History of Present Illness]
    E --> F[ROS - Review of Systems]
    F --> G[PMH - Past Medical History]
    G --> H[Objective Tab]
    H --> I[Vitals Entry/Import]
    I --> J[Physical Exam Documentation]
    J --> K[Assessment Tab]
    K --> L[ICD-10 Diagnosis Search]
    L --> M[Select Diagnosis Codes]
    M --> N[Plan Tab]
    N --> O[Treatment Plan]
    O --> P[Orders: Rx/Labs/Referrals]
    P --> Q[Patient Education]
    Q --> R[Follow-up Instructions]
    R --> S{Complete?}
    S -->|No| T[Return to Incomplete Tab]
    T --> C
    S -->|Yes| U[Sign & Lock]
    U --> V[Capture E-Signature]
    V --> W[Lock Record]
    W --> X[End - Encounter Complete]
    
    style A fill:#0D9488,color:#fff
    style X fill:#10B981,color:#fff
    style S fill:#F59E0B,color:#fff
```

### 4.2 Voice Dictation Flow

```mermaid
flowchart TD
    A[Enable Global Dictation] --> B[Activate Speech Recognition]
    B --> C[Click Field Microphone]
    C --> D[Begin Recording]
    D --> E[User Speaks]
    E --> F[Real-time Transcription]
    F --> G{Continue Speaking?}
    G -->|Yes| E
    G -->|Done| H[Click Mic to Stop]
    H --> I[Finalize Text]
    I --> J[Display in Field]
    J --> K{Edit Needed?}
    K -->|Yes| L[Manual Correction]
    L --> M[End - Text Finalized]
    K -->|No| M
    
    style A fill:#F59E0B,color:#fff
    style M fill:#10B981,color:#fff
    style D fill:#EF4444,color:#fff
```

---

## 5. E-Prescribing Flow

### 5.1 Prescription Creation Flow

```mermaid
flowchart TD
    A[Click Add Prescription] --> B[Open Rx Modal]
    B --> C[Search Medication]
    C --> D[Display Results]
    D --> E[Select Medication]
    E --> F[Check Drug Interactions]
    F --> G{Interactions Found?}
    G -->|Yes| H[Display Alert]
    H --> I{Override?}
    I -->|Yes| J[Document Reason]
    I -->|No| C
    G -->|No| K[Enter Sig Instructions]
    J --> K
    K --> L[Set Quantity & Refills]
    L --> M[Select Pharmacy]
    M --> N[Click Transmit]
    N --> O[Send to Pharmacy]
    O --> P[Log Audit Event]
    P --> Q[End - Rx Sent]
    
    style A fill:#7C3AED,color:#fff
    style Q fill:#10B981,color:#fff
    style G fill:#F59E0B,color:#fff
    style H fill:#EF4444,color:#fff
```

### 5.2 Prescription Status Flow

```mermaid
stateDiagram-v2
    [*] --> Pending: Created
    Pending --> Dispensed: Pharmacy Fills
    Pending --> RequiresAuth: Prior Auth Needed
    Pending --> Cancelled: Provider Cancels
    RequiresAuth --> Pending: Auth Approved
    RequiresAuth --> Cancelled: Auth Denied
    Dispensed --> [*]: Complete
    Cancelled --> [*]: Terminated
```

---

## 6. Lab Orders Flow

### 6.1 Lab Order Creation Flow

```mermaid
flowchart TD
    A[Click Add Lab Order] --> B[Open Lab Modal]
    B --> C[Select Test Category]
    C --> D{Category?}
    D -->|Chemistry| E[Chemistry Panel Tests]
    D -->|Hematology| F[Hematology Tests]
    D -->|Urinalysis| G[Urinalysis Tests]
    D -->|Microbiology| H[Microbiology Tests]
    E --> I[Select Specific Tests]
    F --> I
    G --> I
    H --> I
    I --> J[Set Priority]
    J --> K{Priority Level?}
    K -->|Routine| L[Standard Processing]
    K -->|Stat| M[Urgent Processing]
    L --> N[Select Lab Facility]
    M --> N
    N --> O[Add Clinical Notes]
    O --> P[Submit Order]
    P --> Q[Transmit to Lab]
    Q --> R[End - Order Placed]
    
    style A fill:#2563EB,color:#fff
    style R fill:#10B981,color:#fff
    style K fill:#F59E0B,color:#fff
```

### 6.2 Lab Results Flow

```mermaid
stateDiagram-v2
    [*] --> Ordered: Order Submitted
    Ordered --> Collected: Specimen Drawn
    Collected --> Processing: At Lab
    Processing --> Resulted: Analysis Complete
    Resulted --> Reviewed: Provider Reviews
    Reviewed --> [*]: Complete
    
    Resulted --> Critical: Critical Value
    Critical --> Notified: Alert Sent
    Notified --> Reviewed
```

---

## 7. Referral Flow

### 7.1 Referral Creation Flow

```mermaid
flowchart TD
    A[Click Add Referral] --> B[Open Referral Modal]
    B --> C[Select Specialty]
    C --> D[Display Specialists]
    D --> E[Select Provider]
    E --> F[Set Urgency Level]
    F --> G{Urgency?}
    G -->|Routine| H[Standard Timeline]
    G -->|Urgent| I[Expedited Timeline]
    G -->|Emergent| J[Immediate Contact]
    H --> K[Enter Reason]
    I --> K
    J --> K
    K --> L[Add Clinical Notes]
    L --> M[Attach Documents]
    M --> N[Send Referral]
    N --> O[Transmit to Specialist]
    O --> P[End - Referral Sent]
    
    style A fill:#DB2777,color:#fff
    style P fill:#10B981,color:#fff
    style G fill:#F59E0B,color:#fff
```

### 7.2 Referral Status Flow

```mermaid
stateDiagram-v2
    [*] --> Pending: Created
    Pending --> Sent: Transmitted
    Sent --> Acknowledged: Specialist Receives
    Acknowledged --> Scheduled: Appointment Set
    Scheduled --> Completed: Visit Occurred
    Completed --> NotesReceived: Findings Returned
    NotesReceived --> [*]: Closed
    
    Sent --> Declined: Specialist Declines
    Declined --> Pending: Re-route
```

---

## 8. Messaging Flow

```mermaid
flowchart TD
    A[Navigate to Messages] --> B[Display Inbox]
    B --> C{Action?}
    C -->|Read| D[Open Message]
    D --> E{Reply?}
    E -->|Yes| F[Compose Reply]
    E -->|No| G[Return to Inbox]
    C -->|Compose| H[Click New Message]
    H --> I[Select Message Type]
    I --> J{Type?}
    J -->|Patient| K[Patient Messaging]
    J -->|Provider| L[Provider Messaging]
    J -->|Department| M[Department Messaging]
    J -->|Pharmacy| N[Pharmacy Messaging]
    K --> O[Select Recipient]
    L --> O
    M --> O
    N --> O
    O --> P[Set Priority]
    P --> Q[Enter Subject/Body]
    Q --> R[Attach Files Optional]
    R --> S[Click Send]
    F --> S
    S --> T[Deliver Message]
    T --> U[Log in Sent Folder]
    U --> V[End - Message Sent]
    G --> W[End - Message Read]
    
    style A fill:#6366F1,color:#fff
    style V fill:#10B981,color:#fff
    style W fill:#10B981,color:#fff
```

---

## 9. Appointment Scheduling Flow

```mermaid
flowchart TD
    A[Navigate to Appointments] --> B{View Type?}
    B -->|Day| C[Display Day View]
    B -->|Week| D[Display Week View]
    B -->|List| E[Display List View]
    C --> F[Select Time Slot]
    D --> F
    E --> G[Click Add Appointment]
    F --> G
    G --> H[Open Scheduling Modal]
    H --> I[Search Patient]
    I --> J[Select Patient]
    J --> K[Choose Appointment Type]
    K --> L{Type?}
    L -->|Office Visit| M[30 min Duration]
    L -->|Follow-Up| N[15 min Duration]
    L -->|New Patient| O[45 min Duration]
    L -->|Telemedicine| P[20 min Duration]
    L -->|Procedure| Q[60 min Duration]
    M --> R[Add Notes]
    N --> R
    O --> R
    P --> R
    Q --> R
    R --> S[Click Schedule]
    S --> T[Create Appointment]
    T --> U[Send Confirmation]
    U --> V[End - Scheduled]
    
    style A fill:#0D9488,color:#fff
    style V fill:#10B981,color:#fff
    style L fill:#F59E0B,color:#fff
```

---

## 10. Complete Patient Encounter Flow

```mermaid
flowchart TD
    A[Patient Arrival] --> B[KIOSK Check-In]
    B --> C[Capture Vitals]
    C --> D[Calculate Triage Score]
    D --> E[Add to Queue]
    E --> F[Provider Reviews Queue]
    F --> G[Select Patient]
    G --> H{Encounter Type?}
    H -->|Office| I[Start Office Visit]
    H -->|Video| J[Start Telemedicine]
    I --> K[SOAP Documentation]
    J --> K
    K --> L[Complete Subjective]
    L --> M[Complete Objective]
    M --> N[Complete Assessment]
    N --> O[Complete Plan]
    O --> P{Orders Needed?}
    P -->|Rx| Q[Create Prescriptions]
    P -->|Labs| R[Order Labs]
    P -->|Referral| S[Create Referral]
    P -->|None| T[Continue]
    Q --> T
    R --> T
    S --> T
    T --> U[Patient Education]
    U --> V[Schedule Follow-up]
    V --> W[Sign & Lock Encounter]
    W --> X[Generate After-Visit Summary]
    X --> Y[End - Encounter Complete]
    
    style A fill:#0D9488,color:#fff
    style Y fill:#10B981,color:#fff
    style H fill:#F59E0B,color:#fff
    style P fill:#F59E0B,color:#fff
```

---

## 11. Audit Trail Flow

```mermaid
flowchart TD
    A[User Action Triggered] --> B[Capture Event Data]
    B --> C[Collect User ID]
    C --> D[Collect Workstation ID]
    D --> E[Timestamp UTC]
    E --> F[Identify Action Type]
    F --> G[Capture Patient ID]
    G --> H[Record IP Address]
    H --> I[Determine Success/Failure]
    I --> J[Write to Audit Log]
    J --> K{Sensitive Action?}
    K -->|Yes| L[Flag for Review]
    K -->|No| M[Standard Log Entry]
    L --> N[End - Logged & Flagged]
    M --> O[End - Logged]
    
    style A fill:#059669,color:#fff
    style N fill:#F59E0B,color:#fff
    style O fill:#10B981,color:#fff
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0.1 | Jan 2026 | ExtendiLite Team | Initial release |
| 1.0.0.2 | Jan 2026 | ExtendiLite Team | Added Two-Factor Authentication (2FA) flow diagram |

---

*© 2026 ExtendiLite Health Technologies Inc. All rights reserved.*
