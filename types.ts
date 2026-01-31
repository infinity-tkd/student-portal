
export interface Student {
  id: string;
  nameEN: string;
  nameKH: string;
  pic: string;
  belt: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  joinDate: string;
  eligible: 'YES' | 'NO';
  isScholarship: boolean;
  scholarshipType: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  date: string;
  category: string;
  division: string;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Participation' | string;
  notes: string;
  description: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Late' | 'Absent';
}

export interface Promotion {
  id: string;
  studentId: string;
  rank: string;
  date: string;
  result: string;
  certificateId?: string;
  certificateFileId?: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: string;
  regStart: string;
  regEnd: string;
  eventStart: string;
  eventEnd: string;
  location: string;
  description: string;
  status: 'Open' | 'Closed';
}

export interface LibraryItem {
  id: string;
  belt: string;
  category: string;
  title: string;
  subTitle: string;
  description: string;
  focus: string;
  prerequisite: string;
  videoUrl: string;
  tag: string;
  level: string;
}

export interface BeltPhilosophy {
  found: boolean;
  meaning?: string;
  spirit?: string;
  quote?: string;
  belt?: string;
}

export interface MembershipStatus {
  isPaid: boolean;
  month: string;
  details?: {
    status: string;
    date: string;
    amount: string;
  } | null;
}

// The Big Response Object
export interface PaymentRecord {
  id: string;
  year: string;
  studentId: string;
  month: string;
  status: string;
  date: string;
  amount: string;
}

export interface FullAppData {
  student: Student;
  dashboard: MembershipStatus;
  events: EventItem[];
  achievements: Achievement[];
  attendance: AttendanceRecord[];
  history: Promotion[];
  library: LibraryItem[];
  beltPhilosophy: BeltPhilosophy;
  payments: PaymentRecord[]; // Added payments
}

export interface LoginResponse {
  success: boolean;
  data?: FullAppData;
  message?: string;
}