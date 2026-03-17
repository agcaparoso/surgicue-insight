export const PROCEDURES = [
  "Wound Closure & Suturing",
  "Burr Hole Placement",
  "Laparoscopic Port Placement",
  "Skin Incision Technique",
  "Wound Debridement",
  "Laceration Repair",
];

export const SPECIALTIES = [
  "General Surgery",
  "Neurosurgery",
  "Orthopedics",
  "Cardiothoracic",
  "Vascular",
  "Urology",
  "Other",
];

export const YEARS = ["MS1", "MS2", "MS3", "MS4", "PGY1", "PGY2", "PGY3", "PGY4", "PGY5"];

export const MOCK_SUBMISSIONS = [
  { id: '1', title: 'Wound Closure', date: 'Oct 24', score: 82, status: 'Passed' as const, source: 'video' },
  { id: '2', title: 'Burr Hole', date: 'Oct 22', score: 64, status: 'Flagged' as const, source: 'video' },
  { id: '3', title: 'Skin Incision', date: 'Oct 19', score: 78, status: 'Passed' as const, source: 'photo' },
  { id: '4', title: 'Laceration Repair', date: 'Oct 15', score: 45, status: 'Failed' as const, source: 'scope' },
  { id: '5', title: 'Wound Debridement', date: 'Oct 12', score: 88, status: 'Passed' as const, source: 'video' },
];

export const MOCK_TRAINEES = [
  { name: 'Dr. Jamie Patel', year: 'PGY2', specialty: 'General Surgery', lastScore: 58, trend: 'down', submissions: 6, passRate: '50%', avgScore: 61 },
  { name: 'Dr. Kim Nguyen', year: 'PGY3', specialty: 'Neurosurgery', lastScore: 62, trend: 'down', submissions: 8, passRate: '62%', avgScore: 65 },
  { name: 'Dr. Chris Lopez', year: 'PGY1', specialty: 'Orthopedics', lastScore: 55, trend: 'down', submissions: 4, passRate: '25%', avgScore: 52 },
];
