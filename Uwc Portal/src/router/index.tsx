import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layout'
import {
  HomePage,
  ApplicationPage,
  PersonalInformationPage,
  DemographicInformationPage,
  MatricExamDetailsPage,
  MatricSubjectsPage,
  TertiaryEducationPage,
  ProgramSelectionPage,
  EditApplicationPage,
  ProgramDetailsPage,
  ContactDetailsPage,
  NextOfKinPage,
  FinancialInformationPage,
  GrantsScholarshipsPage,
  DocumentUploadPage,
  AlumniStaffPage,
  AgreementPage,
  CloseApplicationPage,
  HelpSupportPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'help',
        element: <HelpSupportPage />,
      },
      {
        path: 'application',
        children: [
          {
            index: true,
            element: <ApplicationPage />,
          },
          {
            path: 'program-details',
            element: <ProgramDetailsPage />,
          },
          {
            path: 'personal-information',
            element: <PersonalInformationPage />,
          },
          {
            path: 'demographic-information',
            element: <DemographicInformationPage />,
          },
          {
            path: 'contact-details',
            element: <ContactDetailsPage />,
          },
          {
            path: 'next-of-kin',
            element: <NextOfKinPage />,
          },
          {
            path: 'matric-exam-details',
            element: <MatricExamDetailsPage />,
          },
          {
            path: 'matric-subjects',
            element: <MatricSubjectsPage />,
          },
          {
            path: 'tertiary-education',
            element: <TertiaryEducationPage />,
          },
          {
            path: 'program-selection',
            element: <ProgramSelectionPage />,
          },
          {
            path: 'financial-information',
            element: <FinancialInformationPage />,
          },
          {
            path: 'grants-scholarships',
            element: <GrantsScholarshipsPage />,
          },
          {
            path: 'document-upload',
            element: <DocumentUploadPage />,
          },
          {
            path: 'alumni-staff',
            element: <AlumniStaffPage />,
          },
          {
            path: 'agreement',
            element: <AgreementPage />,
          },
          {
            path: 'close',
            element: <CloseApplicationPage />,
          },
          {
            path: 'edit/:id',
            element: <EditApplicationPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
