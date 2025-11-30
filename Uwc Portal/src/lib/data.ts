import type { Application, User, SelectOption, FormSection } from './types'

// Current User Data
export const currentUser: User = {
  id: 'user-001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  studentNumber: '3845721',
  avatarUrl: undefined,
}

// Sample Applications
export const applications: Application[] = [
  {
    id: 'app-001',
    applicationNumber: 'UWC-2025-001234',
    referenceNumber: 'REF-2025-001234',
    status: 'submitted',
    submittedDate: '2024-11-15',
    submissionDate: '2024-11-15',
    lastModified: '2024-11-15T14:30:00Z',
    academicYear: '2025',
    program: 'BSc Computer Science',
    faculty: 'Natural Sciences',
    completionPercentage: 100,
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      idNumber: '9501015800087',
      dateOfBirth: '1995-01-01',
      gender: 'male',
      email: 'john.doe@email.com',
      phone: '0821234567',
      streetAddress: '123 Main Street',
      suburb: 'Bellville',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7530',
    },
    demographicInfo: {
      nationality: 'South African',
      homeLanguage: 'English',
      race: 'African',
      disability: 'no',
      citizenship: 'citizen',
    },
    matricDetails: {
      examYear: '2024',
      examType: 'NSC',
      schoolName: 'Bellville High School',
      province: 'Western Cape',
      examNumber: 'NSC2024-123456',
    },
    matricSubjects: [
      { id: 'sub-1', subject: 'English Home Language', level: 'Higher', mark: 78, symbol: 'B' },
      { id: 'sub-2', subject: 'Afrikaans First Additional Language', level: 'Higher', mark: 65, symbol: 'C' },
      { id: 'sub-3', subject: 'Mathematics', level: 'Higher', mark: 82, symbol: 'B' },
      { id: 'sub-4', subject: 'Physical Sciences', level: 'Higher', mark: 75, symbol: 'B' },
      { id: 'sub-5', subject: 'Life Sciences', level: 'Higher', mark: 80, symbol: 'B' },
      { id: 'sub-6', subject: 'Geography', level: 'Higher', mark: 70, symbol: 'C' },
      { id: 'sub-7', subject: 'Life Orientation', level: 'Standard', mark: 85, symbol: 'A' },
    ],
    programSelection: {
      faculty: 'Science',
      firstChoice: 'BSc Computer Science',
      secondChoice: 'BSc Information Systems',
      thirdChoice: 'BSc Applied Mathematics',
      campusPreference: 'Main Campus',
      studyMode: 'fulltime',
      startSemester: '2025 Semester 1',
    },
    documents: [
      { id: 'doc-1', name: 'ID Document', type: 'identity', status: 'verified', uploadedAt: '2024-11-10T10:00:00Z' },
      { id: 'doc-2', name: 'Matric Certificate', type: 'academic', status: 'pending', uploadedAt: '2024-11-12T14:30:00Z' },
      { id: 'doc-3', name: 'Proof of Residence', type: 'residence', status: 'verified', uploadedAt: '2024-11-10T11:00:00Z' },
    ],
  },
  {
    id: 'app-002',
    applicationNumber: 'UWC-2025-001235',
    referenceNumber: 'REF-2025-001235',
    status: 'draft',
    lastModified: '2024-11-20T09:15:00Z',
    academicYear: '2025',
    program: 'BA Psychology',
    faculty: 'Arts and Humanities',
    completionPercentage: 45,
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      idNumber: '9501015800087',
      dateOfBirth: '1995-01-01',
      gender: 'male',
      email: 'john.doe@email.com',
      phone: '0821234567',
      streetAddress: '123 Main Street',
      suburb: 'Bellville',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7530',
    },
  },
]

// Province Options
export const provinces: SelectOption[] = [
  { value: 'eastern_cape', label: 'Eastern Cape' },
  { value: 'free_state', label: 'Free State' },
  { value: 'gauteng', label: 'Gauteng' },
  { value: 'kwazulu_natal', label: 'KwaZulu-Natal' },
  { value: 'limpopo', label: 'Limpopo' },
  { value: 'mpumalanga', label: 'Mpumalanga' },
  { value: 'north_west', label: 'North West' },
  { value: 'northern_cape', label: 'Northern Cape' },
  { value: 'western_cape', label: 'Western Cape' },
]

// Gender Options
export const genders: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

// Race Options
export const races: SelectOption[] = [
  { value: 'african', label: 'African' },
  { value: 'coloured', label: 'Coloured' },
  { value: 'indian', label: 'Indian' },
  { value: 'white', label: 'White' },
  { value: 'other', label: 'Other' },
]

// Home Language Options
export const homeLanguages: SelectOption[] = [
  { value: 'afrikaans', label: 'Afrikaans' },
  { value: 'english', label: 'English' },
  { value: 'isindebele', label: 'IsiNdebele' },
  { value: 'isixhosa', label: 'IsiXhosa' },
  { value: 'isizulu', label: 'IsiZulu' },
  { value: 'sepedi', label: 'Sepedi' },
  { value: 'sesotho', label: 'Sesotho' },
  { value: 'setswana', label: 'Setswana' },
  { value: 'siswati', label: 'SiSwati' },
  { value: 'tshivenda', label: 'Tshivenda' },
  { value: 'xitsonga', label: 'Xitsonga' },
  { value: 'other', label: 'Other' },
]

// Citizenship Options
export const citizenshipOptions: SelectOption[] = [
  { value: 'citizen', label: 'South African Citizen' },
  { value: 'permanent_resident', label: 'Permanent Resident' },
  { value: 'international', label: 'International Student' },
]

// Exam Type Options
export const examTypes: SelectOption[] = [
  { value: 'NSC', label: 'NSC (National Senior Certificate)' },
  { value: 'IEB', label: 'IEB (Independent Examinations Board)' },
  { value: 'Cambridge', label: 'Cambridge International' },
  { value: 'Other', label: 'Other' },
]

// Subject Level Options
export const subjectLevels: SelectOption[] = [
  { value: 'Higher', label: 'Higher Grade' },
  { value: 'Standard', label: 'Standard Grade' },
]

// Faculty Options
export const faculties: SelectOption[] = [
  { value: 'arts', label: 'Faculty of Arts and Humanities' },
  { value: 'community_health', label: 'Faculty of Community and Health Sciences' },
  { value: 'dentistry', label: 'Faculty of Dentistry' },
  { value: 'economic_management', label: 'Faculty of Economic and Management Sciences' },
  { value: 'education', label: 'Faculty of Education' },
  { value: 'law', label: 'Faculty of Law' },
  { value: 'science', label: 'Faculty of Natural Sciences' },
]

// Program Options by Faculty
export const programsByFaculty: Record<string, SelectOption[]> = {
  arts: [
    { value: 'ba_humanities', label: 'BA Humanities' },
    { value: 'ba_languages', label: 'BA Languages' },
    { value: 'ba_psychology', label: 'BA Psychology' },
    { value: 'bsocsc', label: 'BSocSc Social Science' },
  ],
  community_health: [
    { value: 'bn_nursing', label: 'BN Nursing' },
    { value: 'bsw', label: 'BSW Social Work' },
    { value: 'bsc_dietetics', label: 'BSc Dietetics' },
    { value: 'bsc_physiotherapy', label: 'BSc Physiotherapy' },
  ],
  economic_management: [
    { value: 'bcom_accounting', label: 'BCom Accounting' },
    { value: 'bcom_economics', label: 'BCom Economics' },
    { value: 'bcom_finance', label: 'BCom Finance' },
    { value: 'bcom_management', label: 'BCom Management' },
    { value: 'badmin', label: 'BAdmin Public Administration' },
  ],
  education: [
    { value: 'bed_foundation', label: 'BEd Foundation Phase' },
    { value: 'bed_intermediate', label: 'BEd Intermediate Phase' },
    { value: 'bed_senior', label: 'BEd Senior Phase' },
    { value: 'bed_fet', label: 'BEd FET Phase' },
  ],
  law: [
    { value: 'llb', label: 'LLB Bachelor of Laws' },
    { value: 'ba_law', label: 'BA Law' },
    { value: 'bcom_law', label: 'BCom Law' },
  ],
  science: [
    { value: 'bsc_computer_science', label: 'BSc Computer Science' },
    { value: 'bsc_information_systems', label: 'BSc Information Systems' },
    { value: 'bsc_mathematics', label: 'BSc Mathematics' },
    { value: 'bsc_physics', label: 'BSc Physics' },
    { value: 'bsc_chemistry', label: 'BSc Chemistry' },
    { value: 'bsc_biology', label: 'BSc Biological Sciences' },
  ],
}

// Campus Options
export const campusOptions: SelectOption[] = [
  { value: 'main', label: 'Main Campus (Bellville)' },
  { value: 'tygerberg', label: 'Tygerberg Campus' },
  { value: 'dental', label: 'Dental Campus' },
]

// Study Mode Options
export const studyModes: SelectOption[] = [
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
]

// Semester Options
export const semesterOptions: SelectOption[] = [
  { value: '2025_sem1', label: '2025 Semester 1 (February)' },
  { value: '2025_sem2', label: '2025 Semester 2 (July)' },
  { value: '2026_sem1', label: '2026 Semester 1 (February)' },
]

// Matric Subjects
export const matricSubjects: SelectOption[] = [
  { value: 'english_hl', label: 'English Home Language' },
  { value: 'english_fal', label: 'English First Additional Language' },
  { value: 'afrikaans_hl', label: 'Afrikaans Home Language' },
  { value: 'afrikaans_fal', label: 'Afrikaans First Additional Language' },
  { value: 'isixhosa_hl', label: 'IsiXhosa Home Language' },
  { value: 'isixhosa_fal', label: 'IsiXhosa First Additional Language' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'mathematical_literacy', label: 'Mathematical Literacy' },
  { value: 'physical_sciences', label: 'Physical Sciences' },
  { value: 'life_sciences', label: 'Life Sciences' },
  { value: 'geography', label: 'Geography' },
  { value: 'history', label: 'History' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'business_studies', label: 'Business Studies' },
  { value: 'economics', label: 'Economics' },
  { value: 'information_technology', label: 'Information Technology' },
  { value: 'computer_applications_technology', label: 'Computer Applications Technology' },
  { value: 'life_orientation', label: 'Life Orientation' },
]

// Qualification Types
export const qualificationTypes: SelectOption[] = [
  { value: 'diploma', label: 'Diploma' },
  { value: 'higher_certificate', label: 'Higher Certificate' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'honours', label: 'Honours Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'doctorate', label: 'Doctorate' },
]

// Education Status Options
export const educationStatus: SelectOption[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'incomplete', label: 'Incomplete' },
]

// Form Sections for Application
export const applicationFormSections: FormSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Your personal details and contact information',
    status: 'not_started',
    href: '/application/personal-information',
  },
  {
    id: 'demographic',
    title: 'Demographic Information',
    description: 'Nationality, language, and citizenship details',
    status: 'not_started',
    href: '/application/demographic-information',
  },
  {
    id: 'matric-details',
    title: 'Matric Exam Details',
    description: 'Your matric examination information',
    status: 'not_started',
    href: '/application/matric-exam-details',
  },
  {
    id: 'matric-subjects',
    title: 'Matric Subjects',
    description: 'Your matric subjects and results',
    status: 'not_started',
    href: '/application/matric-subjects',
  },
  {
    id: 'tertiary',
    title: 'Tertiary Education',
    description: 'Previous tertiary qualifications (if any)',
    status: 'not_started',
    href: '/application/tertiary-education',
  },
  {
    id: 'program',
    title: 'Program Selection',
    description: 'Choose your preferred programs',
    status: 'not_started',
    href: '/application/program-selection',
  },
]

// Symbols grade mapping
export const gradeSymbols: Record<string, { min: number; max: number }> = {
  'A': { min: 80, max: 100 },
  'B': { min: 70, max: 79 },
  'C': { min: 60, max: 69 },
  'D': { min: 50, max: 59 },
  'E': { min: 40, max: 49 },
  'F': { min: 30, max: 39 },
  'FF': { min: 0, max: 29 },
}

// Helper function to get symbol from mark
export const getSymbolFromMark = (mark: number): string => {
  for (const [symbol, range] of Object.entries(gradeSymbols)) {
    if (mark >= range.min && mark <= range.max) {
      return symbol
    }
  }
  return 'FF'
}
