// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

// Application Information
export const APP_INFO = {
  name: 'ExtendiLite',
  version: '1.0.0.1',
  environment: 'TST', // DEV, TST, UAT, PRD
  buildDate: '2026-01-02',
};

export const DEMO_CREDENTIALS = { 
  email: 'jide.grand@extendilite.com', 
  password: 'SecurePass123!' 
};

export const MOCK_USER = {
  id: 'USR-001',
  email: 'jide.grand@extendilite.com',
  name: 'Dr. Jide Grand',
  role: 'Provider',
  specialty: 'Internal Medicine',
  npi: '1234567890',
  avatar: 'JG',
  department: 'SHB NUC MED',
  workstationId: 'WS-NUC-001', // Workstation/Device ID
};

export const ID_TYPES = [
  { id: '123001', name: 'ONTARIO HEALTH CARD NUMBER' },
  { id: '123003', name: 'MANITOBA HEALTH CARD NUMBER' },
  { id: '123010', name: 'NOVA SCOTIA HEALTH CARD NUMBER' },
  { id: '355', name: 'CMH GAIN' },
  { id: '0', name: 'ENTERPRISE ID NUMBER' },
];

export const ICD10_CODES = [
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'I20.9', description: 'Angina pectoris, unspecified' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'R05.9', description: 'Cough, unspecified' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'Z30.41', description: 'Encounter for surveillance of contraceptive pills' },
];

export const MEDICATIONS_DB = [
  { name: 'Azithromycin', strengths: ['250mg', '500mg'], forms: ['Tablet', 'Suspension'] },
  { name: 'Amoxicillin', strengths: ['250mg', '500mg', '875mg'], forms: ['Capsule', 'Tablet', 'Suspension'] },
  { name: 'Benzonatate', strengths: ['100mg', '200mg'], forms: ['Capsule'] },
  { name: 'Guaifenesin', strengths: ['400mg', '600mg', '1200mg'], forms: ['Tablet', 'ER Tablet'] },
  { name: 'Albuterol', strengths: ['90mcg'], forms: ['Inhaler'] },
  { name: 'Prednisone', strengths: ['5mg', '10mg', '20mg'], forms: ['Tablet'] },
  { name: 'Metoprolol', strengths: ['25mg', '50mg', '100mg'], forms: ['Tablet', 'ER Tablet'] },
  { name: 'Lisinopril', strengths: ['5mg', '10mg', '20mg', '40mg'], forms: ['Tablet'] },
  { name: 'Atorvastatin', strengths: ['10mg', '20mg', '40mg', '80mg'], forms: ['Tablet'] },
  { name: 'Metformin', strengths: ['500mg', '850mg', '1000mg'], forms: ['Tablet', 'ER Tablet'] },
];

export const LAB_TESTS = [
  { category: 'Chemistry', tests: ['BMP', 'CMP', 'Lipid Panel', 'HbA1c', 'TSH', 'Free T4', 'LFTs', 'Glucose'] },
  { category: 'Hematology', tests: ['CBC', 'CBC w/ Diff', 'PT/INR', 'PTT', 'D-Dimer'] },
  { category: 'Cardiac', tests: ['Troponin I', 'BNP', 'CK-MB'] },
  { category: 'Inflammatory', tests: ['ESR', 'CRP', 'Procalcitonin'] },
  { category: 'Urinalysis', tests: ['UA', 'Urine Culture', 'Urine Drug Screen'] },
];

export const SPECIALTIES = [
  'Cardiology', 'Neurology', 'Pulmonology', 'Gastroenterology', 'Endocrinology',
  'Rheumatology', 'Nephrology', 'Oncology', 'Orthopedics', 'Dermatology',
  'Ophthalmology', 'ENT', 'Urology', 'Psychiatry', 'Physical Therapy'
];

export const SIG_TEMPLATES = [
  'Take 1 tablet by mouth once daily',
  'Take 1 tablet by mouth twice daily',
  'Take 1 tablet by mouth three times daily',
  'Take 1 tablet by mouth every 8 hours',
  'Take 1 tablet by mouth at bedtime',
  'Take 2 tablets by mouth once daily',
  'Take as directed',
];

export const PHARMACIES = [
  'Shoppers Drug Mart #1234',
  'Rexall Pharmacy',
  'Costco Pharmacy',
  'Walmart Pharmacy',
  'Patient Pickup'
];

export const LAB_FACILITIES = [
  'Toronto General Lab',
  'LifeLabs',
  'Dynacare',
  'Community Lab Services'
];
