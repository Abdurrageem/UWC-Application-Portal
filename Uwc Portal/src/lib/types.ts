import type { ComponentType, ReactNode } from 'react'

// Application Status Types
export type ApplicationStatus = 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected' | 'incomplete'

// User Information
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  studentNumber?: string
  avatarUrl?: string
}

// Application Data
export interface Application {
  id: string
  applicationNumber: string
  referenceNumber: string
  status: ApplicationStatus
  submittedDate?: string
  submissionDate?: string
  lastModified: string
  academicYear: string
  program: string
  faculty: string
  personalInfo?: PersonalInfoData
  demographicInfo?: DemographicInfoData
  matricDetails?: MatricDetailsData
  matricSubjects?: MatricSubjectData[]
  tertiaryEducation?: TertiaryEducationData[]
  programSelection?: ProgramSelectionData
  documents?: DocumentData[]
  completionPercentage: number
}

export interface PersonalInfoData {
  firstName: string
  lastName: string
  idNumber: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  alternativePhone?: string
  streetAddress: string
  suburb: string
  city: string
  province: string
  postalCode: string
}

export interface DemographicInfoData {
  nationality: string
  homeLanguage: string
  race: string
  disability: string
  disabilityType?: string
  citizenship: string
}

export interface MatricDetailsData {
  examYear: string
  examType: string
  schoolName: string
  schoolEmisNumber?: string
  province: string
  examNumber?: string
}

export interface MatricSubjectData {
  id: string
  subject: string
  level: string
  mark?: number
  symbol?: string
}

export interface TertiaryEducationData {
  id: string
  institutionName: string
  qualificationType: string
  qualificationName: string
  studentNumber?: string
  startYear: string
  endYear?: string
  status: string
}

export interface ProgramSelectionData {
  faculty: string
  firstChoice: string
  secondChoice?: string
  thirdChoice?: string
  campusPreference: string
  studyMode: string
  startSemester: string
}

export interface DocumentData {
  id: string
  name: string
  type: string
  status: 'pending' | 'verified' | 'rejected'
  uploadedAt: string
  fileUrl?: string
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon?: ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
}

// Form Section Types
export interface FormSection {
  id: string
  title: string
  description: string
  status: 'complete' | 'incomplete' | 'not_started'
  href: string
}

// Select Option Types
export interface SelectOption {
  value: string
  label: string
}

// Table Column Types
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  width?: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'
