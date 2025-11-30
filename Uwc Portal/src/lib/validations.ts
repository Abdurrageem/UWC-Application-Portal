import { z } from 'zod'

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  idNumber: z.string().length(13, 'ID number must be exactly 13 digits').regex(/^\d+$/, 'ID number must contain only digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select a gender' }),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[\d\s+-]+$/, 'Please enter a valid phone number'),
  alternativePhone: z.string().optional(),
  streetAddress: z.string().min(5, 'Street address is required'),
  suburb: z.string().min(2, 'Suburb is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
})

// Demographic Information Schema
export const demographicSchema = z.object({
  nationality: z.string().min(1, 'Nationality is required'),
  homeLanguage: z.string().min(1, 'Home language is required'),
  race: z.string().min(1, 'Race is required'),
  disability: z.enum(['yes', 'no'], { required_error: 'Please indicate if you have a disability' }),
  disabilityType: z.string().optional(),
  citizenship: z.enum(['citizen', 'permanent_resident', 'international'], { required_error: 'Please select citizenship status' }),
})

// Matric Exam Details Schema
export const matricExamSchema = z.object({
  examYear: z.string().min(4, 'Exam year is required'),
  examType: z.enum(['NSC', 'IEB', 'Cambridge', 'Other'], { required_error: 'Please select exam type' }),
  schoolName: z.string().min(2, 'School name is required'),
  schoolEmisNumber: z.string().optional(),
  province: z.string().min(1, 'Province is required'),
  examNumber: z.string().optional(),
})

// Matric Subject Schema
export const matricSubjectSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  level: z.enum(['Higher', 'Standard', 'SG', 'HG'], { required_error: 'Level is required' }),
  mark: z.number().min(0).max(100).optional(),
  symbol: z.string().optional(),
})

// Tertiary Education Schema
export const tertiaryEducationSchema = z.object({
  institutionName: z.string().min(2, 'Institution name is required'),
  qualificationType: z.string().min(1, 'Qualification type is required'),
  qualificationName: z.string().min(2, 'Qualification name is required'),
  studentNumber: z.string().optional(),
  startYear: z.string().min(4, 'Start year is required'),
  endYear: z.string().optional(),
  status: z.enum(['completed', 'in_progress', 'incomplete'], { required_error: 'Status is required' }),
})

// Program Selection Schema
export const programSelectionSchema = z.object({
  faculty: z.string().min(1, 'Please select a faculty'),
  firstChoice: z.string().min(1, 'First choice program is required'),
  secondChoice: z.string().optional(),
  thirdChoice: z.string().optional(),
  campusPreference: z.string().min(1, 'Campus preference is required'),
  studyMode: z.enum(['fulltime', 'parttime'], { required_error: 'Study mode is required' }),
  startSemester: z.string().min(1, 'Start semester is required'),
})

// Types
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type DemographicInfo = z.infer<typeof demographicSchema>
export type MatricExam = z.infer<typeof matricExamSchema>
export type MatricSubject = z.infer<typeof matricSubjectSchema>
export type TertiaryEducation = z.infer<typeof tertiaryEducationSchema>
export type ProgramSelection = z.infer<typeof programSelectionSchema>
