import { Student, Achievement, AttendanceRecord, Promotion, EventItem, LibraryItem } from '../types';

export const MOCK_STUDENT: Student = {
  id: "STU-2023-001",
  nameEN: "Somanita Norodom",
  nameKH: "នរោត្តម សុម៉ានីតា",
  pic: "https://picsum.photos/400/400",
  belt: "Green Belt",
  gender: "Female",
  dob: "2010-05-15",
  phone: "012-345-678",
  email: "student@example.com",
  joinDate: "2022-01-10",
  eligible: 'YES',
  isScholarship: true,
  scholarshipType: "Athlete"
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "1", studentId: "STU-2023-001", title: "National Championship 2023", date: "2023-12-15", category: "Poomsae", division: "Junior Female", medal: "Gold", notes: "Excellent presentation.", description: "First place in individual forms." },
  { id: "2", studentId: "STU-2023-001", title: "City Open 2023", date: "2023-06-20", category: "Sparring", division: "-45kg", medal: "Silver", notes: "Close match.", description: "Final round vs Club A." },
  { id: "3", studentId: "STU-2023-001", title: "Club Internal", date: "2022-11-05", category: "Demonstration", division: "Team", medal: "Bronze", notes: "", description: "Team synchronized kick." }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  // Generating some recent dates
  { id: "1", studentId: "STU-2023-001", date: new Date().toISOString().split('T')[0], status: 'Present' },
  { id: "2", studentId: "STU-2023-001", date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'Present' },
  { id: "3", studentId: "STU-2023-001", date: new Date(Date.now() - 172800000).toISOString().split('T')[0], status: 'Late' },
  { id: "4", studentId: "STU-2023-001", date: new Date(Date.now() - 259200000).toISOString().split('T')[0], status: 'Absent' },
];

export const MOCK_HISTORY: Promotion[] = [
  { id: "1", studentId: "STU-2023-001", rank: "Yellow", date: "2022-06-01", result: "Passed" },
  { id: "2", studentId: "STU-2023-001", rank: "Green", date: "2023-01-15", result: "Passed with Distinction" }
];

export const MOCK_EVENTS: EventItem[] = [
  { id: "1", title: "Annual Summer Camp", type: "Camp", regStart: "2024-05-01", regEnd: "2024-05-30", eventStart: "2024-06-15", eventEnd: "2024-06-20", location: "Kep Province", description: "Intensive training camp by the sea.", status: "Open" },
  { id: "2", title: "Black Belt Grading", type: "Test", regStart: "2024-07-01", regEnd: "2024-07-15", eventStart: "2024-08-01", eventEnd: "2024-08-01", location: "Main Dojang", description: "Dan promotion test.", status: "Closed" }
];

export const MOCK_LIBRARY: LibraryItem[] = [
  { id: "1", belt: "White", category: "Basic", title: "Front Kick (Ap Chagi)", subTitle: "Core Technique", description: "The fundamental kick of Taekwondo.", focus: "Snap & Balance", prerequisite: "None", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "Kicking" },
  { id: "2", belt: "Yellow", category: "Poomsae", title: "Taegeuk Il Jang", subTitle: "Form 1", description: "Represents Heaven and Light.", focus: "Stance accuracy", prerequisite: "White Belt", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "Forms" },
  { id: "3", belt: "Green", category: "Sparring", title: "Roundhouse Counter", subTitle: "Reaction Drill", description: "Timing the counter attack.", focus: "Speed", prerequisite: "Yellow Belt", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "Drills" }
];