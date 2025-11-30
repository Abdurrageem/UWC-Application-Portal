import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Edit2, User, MapPin, GraduationCap, BookOpen, Building2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageContainer } from '@/components'
import { pageTransition, fadeIn, staggerContainer, staggerItem } from '@/lib/animations'
import { applications } from '@/lib/data'
import { toast } from 'sonner'

// Mock detailed application data
const applicationDetails = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    idNumber: '9501015800089',
    dateOfBirth: '1995-01-01',
    gender: 'Male',
    email: 'john.doe@email.com',
    phone: '+27 82 123 4567',
    alternativePhone: '+27 21 987 6543',
  },
  address: {
    streetAddress: '123 Main Street',
    suburb: 'Bellville',
    city: 'Cape Town',
    province: 'Western Cape',
    postalCode: '7535',
    country: 'South Africa',
  },
  demographics: {
    citizenship: 'South African',
    race: 'African',
    homeLanguage: 'English',
    disability: 'None',
  },
  matricDetails: {
    examBoard: 'Department of Basic Education (DBE)',
    examYear: '2023',
    schoolName: 'Cape Town High School',
    province: 'Western Cape',
    examinationType: 'National Senior Certificate (NSC)',
    certificateNumber: 'NSC2023123456',
  },
  matricSubjects: [
    { name: 'English Home Language', level: 'Higher', symbol: 'B', percentage: 75 },
    { name: 'Mathematics', level: 'Higher', symbol: 'A', percentage: 85 },
    { name: 'Physical Sciences', level: 'Higher', symbol: 'B', percentage: 72 },
    { name: 'Life Sciences', level: 'Higher', symbol: 'A', percentage: 80 },
    { name: 'Geography', level: 'Higher', symbol: 'B', percentage: 74 },
    { name: 'Afrikaans First Additional Language', level: 'Higher', symbol: 'C', percentage: 65 },
    { name: 'Life Orientation', level: 'Standard', symbol: 'A', percentage: 88 },
  ],
  tertiaryEducation: {
    hasPreviousStudies: true,
    qualifications: [
      {
        institution: 'Cape Peninsula University of Technology',
        qualification: 'National Diploma in IT',
        field: 'Information Technology',
        status: 'Incomplete',
        startYear: '2020',
        endYear: '2021',
      },
    ],
  },
  programSelection: {
    faculty: 'Natural Sciences',
    firstChoice: 'BSc Computer Science',
    secondChoice: 'BSc Information Systems',
    thirdChoice: '',
    studyMode: 'Full-time',
    campus: 'Bellville Campus',
    intakeYear: '2024',
    intakeSemester: 'Semester 1 (February)',
  },
}

interface InfoRowProps {
  label: string
  value: string | undefined
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || '-'}</span>
    </div>
  )
}

interface InfoSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  onEdit?: () => void
}

function InfoSection({ title, icon, children, onEdit }: InfoSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function EditApplicationPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('personal')

  // Find the application (in real app, this would be fetched from API)
  const application = applications.find((app) => app.id === id)

  if (!application) {
    return (
      <PageContainer title="Application Not Found" description="">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            The application you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </PageContainer>
    )
  }

  const handleEdit = (section: string) => {
    toast.info(`Editing ${section} section...`)
    // In real app, navigate to the appropriate edit page
    switch (section) {
      case 'personal':
        navigate('/application/personal-information')
        break
      case 'demographics':
        navigate('/application/demographic-information')
        break
      case 'matric':
        navigate('/application/matric-exam-details')
        break
      case 'subjects':
        navigate('/application/matric-subjects')
        break
      case 'tertiary':
        navigate('/application/tertiary-education')
        break
      case 'program':
        navigate('/application/program-selection')
        break
    }
  }

  const handleSave = () => {
    toast.success('Changes saved successfully!')
    navigate('/')
  }

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'outline'
    }
  }

  return (
    <PageContainer
      title="Edit Application"
      description={`Application Reference: ${application.referenceNumber}`}
    >
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        {/* Application Header */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{application.program}</h2>
                  <p className="text-muted-foreground">{application.faculty}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Applied: {new Date(application.submittedDate || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for different sections */}
        <motion.div variants={fadeIn}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="matric">Matric</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="tertiary">Tertiary</TabsTrigger>
              <TabsTrigger value="program">Program</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-6">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                <motion.div variants={staggerItem}>
                  <InfoSection
                    title="Personal Details"
                    icon={<User className="h-5 w-5 text-primary" />}
                    onEdit={() => handleEdit('personal')}
                  >
                    <div className="divide-y">
                      <InfoRow label="First Name" value={applicationDetails.personalInfo.firstName} />
                      <InfoRow label="Last Name" value={applicationDetails.personalInfo.lastName} />
                      <InfoRow label="ID Number" value={applicationDetails.personalInfo.idNumber} />
                      <InfoRow label="Date of Birth" value={applicationDetails.personalInfo.dateOfBirth} />
                      <InfoRow label="Gender" value={applicationDetails.personalInfo.gender} />
                      <InfoRow label="Email" value={applicationDetails.personalInfo.email} />
                      <InfoRow label="Phone" value={applicationDetails.personalInfo.phone} />
                      <InfoRow label="Alternative Phone" value={applicationDetails.personalInfo.alternativePhone} />
                    </div>
                  </InfoSection>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <InfoSection
                    title="Address"
                    icon={<MapPin className="h-5 w-5 text-primary" />}
                    onEdit={() => handleEdit('personal')}
                  >
                    <div className="divide-y">
                      <InfoRow label="Street Address" value={applicationDetails.address.streetAddress} />
                      <InfoRow label="Suburb" value={applicationDetails.address.suburb} />
                      <InfoRow label="City" value={applicationDetails.address.city} />
                      <InfoRow label="Province" value={applicationDetails.address.province} />
                      <InfoRow label="Postal Code" value={applicationDetails.address.postalCode} />
                      <InfoRow label="Country" value={applicationDetails.address.country} />
                    </div>
                  </InfoSection>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4 mt-6">
              <motion.div variants={fadeIn}>
                <InfoSection
                  title="Demographic Information"
                  icon={<User className="h-5 w-5 text-primary" />}
                  onEdit={() => handleEdit('demographics')}
                >
                  <div className="divide-y">
                    <InfoRow label="Citizenship" value={applicationDetails.demographics.citizenship} />
                    <InfoRow label="Race" value={applicationDetails.demographics.race} />
                    <InfoRow label="Home Language" value={applicationDetails.demographics.homeLanguage} />
                    <InfoRow label="Disability Status" value={applicationDetails.demographics.disability} />
                  </div>
                </InfoSection>
              </motion.div>
            </TabsContent>

            <TabsContent value="matric" className="space-y-4 mt-6">
              <motion.div variants={fadeIn}>
                <InfoSection
                  title="Matric Examination Details"
                  icon={<GraduationCap className="h-5 w-5 text-primary" />}
                  onEdit={() => handleEdit('matric')}
                >
                  <div className="divide-y">
                    <InfoRow label="Examination Board" value={applicationDetails.matricDetails.examBoard} />
                    <InfoRow label="Examination Year" value={applicationDetails.matricDetails.examYear} />
                    <InfoRow label="Examination Type" value={applicationDetails.matricDetails.examinationType} />
                    <InfoRow label="School Name" value={applicationDetails.matricDetails.schoolName} />
                    <InfoRow label="Province" value={applicationDetails.matricDetails.province} />
                    <InfoRow label="Certificate Number" value={applicationDetails.matricDetails.certificateNumber} />
                  </div>
                </InfoSection>
              </motion.div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4 mt-6">
              <motion.div variants={fadeIn}>
                <InfoSection
                  title="Matric Subjects"
                  icon={<BookOpen className="h-5 w-5 text-primary" />}
                  onEdit={() => handleEdit('subjects')}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Subject</th>
                          <th className="text-left py-2 font-medium">Level</th>
                          <th className="text-center py-2 font-medium">Symbol</th>
                          <th className="text-right py-2 font-medium">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicationDetails.matricSubjects.map((subject, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2">{subject.name}</td>
                            <td className="py-2">{subject.level}</td>
                            <td className="py-2 text-center">
                              <Badge variant="outline">{subject.symbol}</Badge>
                            </td>
                            <td className="py-2 text-right font-medium">{subject.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total APS Score</span>
                    <Badge className="text-lg px-4 py-1">42</Badge>
                  </div>
                </InfoSection>
              </motion.div>
            </TabsContent>

            <TabsContent value="tertiary" className="space-y-4 mt-6">
              <motion.div variants={fadeIn}>
                <InfoSection
                  title="Previous Tertiary Education"
                  icon={<Building2 className="h-5 w-5 text-primary" />}
                  onEdit={() => handleEdit('tertiary')}
                >
                  {applicationDetails.tertiaryEducation.hasPreviousStudies ? (
                    <div className="space-y-4">
                      {applicationDetails.tertiaryEducation.qualifications.map((qual, index) => (
                        <Card key={index} className="bg-muted/50">
                          <CardContent className="pt-4">
                            <div className="divide-y">
                              <InfoRow label="Institution" value={qual.institution} />
                              <InfoRow label="Qualification" value={qual.qualification} />
                              <InfoRow label="Field of Study" value={qual.field} />
                              <InfoRow label="Status" value={qual.status} />
                              <InfoRow label="Period" value={`${qual.startYear} - ${qual.endYear}`} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No previous tertiary education recorded.
                    </p>
                  )}
                </InfoSection>
              </motion.div>
            </TabsContent>

            <TabsContent value="program" className="space-y-4 mt-6">
              <motion.div variants={fadeIn}>
                <InfoSection
                  title="Program Selection"
                  icon={<GraduationCap className="h-5 w-5 text-primary" />}
                  onEdit={() => handleEdit('program')}
                >
                  <div className="divide-y">
                    <InfoRow label="Faculty" value={applicationDetails.programSelection.faculty} />
                    <InfoRow label="First Choice" value={applicationDetails.programSelection.firstChoice} />
                    <InfoRow label="Second Choice" value={applicationDetails.programSelection.secondChoice} />
                    <InfoRow label="Third Choice" value={applicationDetails.programSelection.thirdChoice || 'Not specified'} />
                    <Separator className="my-2" />
                    <InfoRow label="Study Mode" value={applicationDetails.programSelection.studyMode} />
                    <InfoRow label="Campus" value={applicationDetails.programSelection.campus} />
                    <InfoRow label="Intake Year" value={applicationDetails.programSelection.intakeYear} />
                    <InfoRow label="Intake Semester" value={applicationDetails.programSelection.intakeSemester} />
                  </div>
                </InfoSection>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
