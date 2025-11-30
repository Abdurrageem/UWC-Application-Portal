import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, GraduationCap, Calendar, Building2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'
import { useApplication } from '@/context'

const programDetailsSchema = z.object({
  studyType: z.string().min(1, 'Study type is required'),
  yearOfAdmission: z.string().min(1, 'Year of admission is required'),
  faculty: z.string().min(1, 'Faculty is required'),
  program: z.string().min(1, 'Program is required'),
  secondChoice: z.string().optional(),
  thirdChoice: z.string().optional(),
})

type ProgramDetailsFormValues = z.infer<typeof programDetailsSchema>

const studyTypes = [
  { value: 'full-time', label: 'Full-time', description: 'Attend classes during regular hours' },
  { value: 'part-time', label: 'Part-time', description: 'Attend classes in the evenings or weekends' },
]

const admissionYears = [
  new Date().getFullYear().toString(),
  (new Date().getFullYear() + 1).toString(),
  (new Date().getFullYear() + 2).toString(),
]

const faculties = [
  'Arts and Humanities',
  'Community and Health Sciences',
  'Dentistry',
  'Economic and Management Sciences',
  'Education',
  'Law',
  'Natural Sciences',
]

const programsByFaculty: Record<string, string[]> = {
  'Arts and Humanities': [
    'BA General',
    'BA Languages',
    'BA Psychology',
    'BA Political Studies',
    'BA History',
    'BA Media Studies',
    'BA Philosophy',
    'BA Sociology',
  ],
  'Community and Health Sciences': [
    'BSc Nursing',
    'BSc Dietetics',
    'BSc Physiotherapy',
    'BSc Occupational Therapy',
    'BSc Sport Science',
    'BSocial Work',
    'BSc Psychology',
  ],
  'Dentistry': [
    'BChD Dentistry',
    'BOH Oral Health',
  ],
  'Economic and Management Sciences': [
    'BCom General',
    'BCom Accounting',
    'BCom Economics',
    'BCom Management',
    'BCom Finance',
    'BCom Information Systems',
    'BCom Industrial Psychology',
    'BAdmin Public Administration',
  ],
  'Education': [
    'BEd Foundation Phase',
    'BEd Intermediate Phase',
    'BEd Senior Phase',
    'BEd FET Phase',
    'PGCE Post Graduate Certificate in Education',
  ],
  'Law': [
    'LLB',
    'BA Law',
    'BCom Law',
  ],
  'Natural Sciences': [
    'BSc General',
    'BSc Computer Science',
    'BSc Information Systems',
    'BSc Mathematics',
    'BSc Physics',
    'BSc Chemistry',
    'BSc Biological Sciences',
    'BSc Environmental Science',
    'BSc Biotechnology',
  ],
}

const steps = [
  { label: 'Program', path: '/application/program-details' },
  { label: 'Personal', path: '/application/personal-information' },
  { label: 'Contact', path: '/application/contact-details' },
  { label: 'Next of Kin', path: '/application/next-of-kin' },
  { label: 'Financial', path: '/application/financial-information' },
  { label: 'Documents', path: '/application/document-upload' },
]

export function ProgramDetailsPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramDetailsFormValues>({
    resolver: zodResolver(programDetailsSchema),
    defaultValues: {
      studyType: '',
      yearOfAdmission: '',
      faculty: '',
      program: '',
      secondChoice: '',
      thirdChoice: '',
    },
  })

  const selectedStudyType = watch('studyType')
  const selectedFaculty = watch('faculty')
  const availablePrograms = selectedFaculty ? programsByFaculty[selectedFaculty] || [] : []

  const onSubmit = async (data: ProgramDetailsFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('program-details', data)
      completeStep('program-details')
      toast.success('Program details saved successfully!')
      navigate('/application/personal-information')
    } catch {
      toast.error('Failed to save program details. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAndExit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('Progress saved!')
      navigate('/')
    } catch {
      toast.error('Failed to save progress.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer
      title="Program Details"
      description="Select your study type and preferred program"
    >
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        {/* Progress Bar */}
        <motion.div variants={fadeIn}>
          <ProgressBar steps={steps} currentStep={0} />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Study Type Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Study Type"
              description="Select how you would like to study"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {studyTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      selectedStudyType === type.value
                        ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600'
                        : 'hover:border-primary-300'
                    }`}
                    onClick={() => setValue('studyType', type.value)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedStudyType === type.value ? 'bg-primary-600 text-white' : 'bg-neutral-100'
                      }`}>
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.studyType && (
                <p className="text-sm text-destructive mt-2">{errors.studyType.message}</p>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Year of Admission */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Year of Admission"
              description="When do you plan to start your studies?"
            >
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label>Year of Admission *</Label>
                </div>
                <Select onValueChange={(value: string) => setValue('yearOfAdmission', value)}>
                  <SelectTrigger className={errors.yearOfAdmission ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {admissionYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.yearOfAdmission && (
                  <p className="text-sm text-destructive mt-1">{errors.yearOfAdmission.message}</p>
                )}
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Program Selection */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Program Selection"
              description="Choose your faculty and preferred programs"
            >
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label>Faculty *</Label>
                  </div>
                  <Select
                    onValueChange={(value: string) => {
                      setValue('faculty', value)
                      setValue('program', '')
                      setValue('secondChoice', '')
                      setValue('thirdChoice', '')
                    }}
                  >
                    <SelectTrigger className={errors.faculty ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty} value={faculty}>
                          {faculty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.faculty && (
                    <p className="text-sm text-destructive">{errors.faculty.message}</p>
                  )}
                </div>

                {selectedFaculty && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-6 sm:grid-cols-3"
                  >
                    <div className="space-y-2">
                      <Label>First Choice Program *</Label>
                      <Select onValueChange={(value: string) => setValue('program', value)}>
                        <SelectTrigger className={errors.program ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePrograms.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.program && (
                        <p className="text-sm text-destructive">{errors.program.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Second Choice (Optional)</Label>
                      <Select onValueChange={(value: string) => setValue('secondChoice', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePrograms.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Third Choice (Optional)</Label>
                      <Select onValueChange={(value: string) => setValue('thirdChoice', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePrograms.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/application')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveAndExit}
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                Save & Exit
              </Button>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </PageContainer>
  )
}
