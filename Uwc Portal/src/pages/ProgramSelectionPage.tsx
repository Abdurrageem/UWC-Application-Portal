import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Send, BookOpen, Calendar, Clock, MapPin, Info, CheckCircle2 } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn, staggerContainer, staggerItem } from '@/lib/animations'
import { toast } from 'sonner'

const programSelectionSchema = z.object({
  faculty: z.string().min(1, 'Faculty is required'),
  firstChoice: z.string().min(1, 'First choice program is required'),
  secondChoice: z.string().optional(),
  thirdChoice: z.string().optional(),
  studyMode: z.string().min(1, 'Study mode is required'),
  campus: z.string().min(1, 'Campus is required'),
  intakeYear: z.string().min(1, 'Intake year is required'),
  intakeSemester: z.string().min(1, 'Intake semester is required'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  declarationAccurate: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the accuracy of your information',
  }),
})

type ProgramSelectionFormValues = z.infer<typeof programSelectionSchema>

const faculties = [
  'Arts and Humanities',
  'Community and Health Sciences',
  'Dentistry',
  'Economic and Management Sciences',
  'Education',
  'Engineering',
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
  ],
  'Community and Health Sciences': [
    'BSc Nursing',
    'BSc Dietetics',
    'BSc Physiotherapy',
    'BSc Occupational Therapy',
    'BSc Sport Science',
    'Social Work',
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
    'BAdmin Public Administration',
  ],
  'Education': [
    'BEd Foundation Phase',
    'BEd Intermediate Phase',
    'BEd Senior Phase',
    'BEd FET Phase',
  ],
  'Engineering': [
    'BSc Engineering (Chemical)',
    'BSc Engineering (Civil)',
    'BSc Engineering (Electrical)',
    'BSc Engineering (Mechanical)',
    'BSc Engineering (Industrial)',
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
  ],
}

const studyModes = [
  { value: 'full-time', label: 'Full-time', description: 'Attend classes during the day' },
  { value: 'part-time', label: 'Part-time', description: 'Attend classes in the evening' },
  { value: 'distance', label: 'Distance Learning', description: 'Study remotely with periodic contact sessions' },
]

const campuses = [
  { value: 'bellville', label: 'Bellville Campus', description: 'Main campus' },
  { value: 'tygerberg', label: 'Tygerberg Campus', description: 'Health Sciences' },
  { value: 'worcester', label: 'Worcester Campus', description: 'Distance learning hub' },
]

const intakeYears = [
  new Date().getFullYear().toString(),
  (new Date().getFullYear() + 1).toString(),
]

const intakeSemesters = [
  { value: 'semester-1', label: 'Semester 1 (February)' },
  { value: 'semester-2', label: 'Semester 2 (July)' },
]

const steps = [
  { label: 'Personal Info', path: '/application/personal-information' },
  { label: 'Demographics', path: '/application/demographic-information' },
  { label: 'Matric Details', path: '/application/matric-exam-details' },
  { label: 'Subjects', path: '/application/matric-subjects' },
  { label: 'Tertiary', path: '/application/tertiary-education' },
  { label: 'Program', path: '/application/program-selection' },
]

export function ProgramSelectionPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState<ProgramSelectionFormValues | null>(null)

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramSelectionFormValues>({
    resolver: zodResolver(programSelectionSchema),
    defaultValues: {
      faculty: '',
      firstChoice: '',
      secondChoice: '',
      thirdChoice: '',
      studyMode: '',
      campus: '',
      intakeYear: '',
      intakeSemester: '',
      acceptTerms: false,
      declarationAccurate: false,
    },
  })

  const selectedFaculty = watch('faculty')
  const acceptTerms = watch('acceptTerms')
  const declarationAccurate = watch('declarationAccurate')
  const availablePrograms = selectedFaculty ? programsByFaculty[selectedFaculty] || [] : []

  const onSubmit = (data: ProgramSelectionFormValues) => {
    setFormData(data)
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = async () => {
    if (!formData) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Final form data:', formData)
      toast.success('Application submitted successfully!')
      navigate('/application/status')
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  const handleSaveAndExit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('Progress saved!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to save progress.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer
      title="Program Selection"
      description="Select your preferred program and study options"
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
          <ProgressBar steps={steps} currentStep={5} />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Faculty Selection */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Faculty Selection"
              description="Choose your faculty and preferred programs"
            >
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="faculty">Faculty *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the faculty that offers your desired program</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    onValueChange={(value) => {
                      setValue('faculty', value)
                      setValue('firstChoice', '')
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
                      <Label htmlFor="firstChoice">First Choice Program *</Label>
                      <Select onValueChange={(value) => setValue('firstChoice', value)}>
                        <SelectTrigger className={errors.firstChoice ? 'border-destructive' : ''}>
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
                      {errors.firstChoice && (
                        <p className="text-sm text-destructive">{errors.firstChoice.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondChoice">Second Choice (Optional)</Label>
                      <Select onValueChange={(value) => setValue('secondChoice', value)}>
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
                      <Label htmlFor="thirdChoice">Third Choice (Optional)</Label>
                      <Select onValueChange={(value) => setValue('thirdChoice', value)}>
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

          {/* Study Options */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Study Options"
              description="Select your preferred study mode and campus"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label>Study Mode *</Label>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-2"
                  >
                    {studyModes.map((mode) => (
                      <motion.div key={mode.value} variants={staggerItem}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            watch('studyMode') === mode.value
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setValue('studyMode', mode.value)}
                        >
                          <CardContent className="p-4 flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">{mode.label}</p>
                              <p className="text-sm text-muted-foreground">{mode.description}</p>
                            </div>
                            {watch('studyMode') === mode.value && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                  {errors.studyMode && (
                    <p className="text-sm text-destructive">{errors.studyMode.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Campus *</Label>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-2"
                  >
                    {campuses.map((campus) => (
                      <motion.div key={campus.value} variants={staggerItem}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            watch('campus') === campus.value
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setValue('campus', campus.value)}
                        >
                          <CardContent className="p-4 flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">{campus.label}</p>
                              <p className="text-sm text-muted-foreground">{campus.description}</p>
                            </div>
                            {watch('campus') === campus.value && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                  {errors.campus && (
                    <p className="text-sm text-destructive">{errors.campus.message}</p>
                  )}
                </div>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Intake Selection */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Intake Period"
              description="When do you plan to start your studies?"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="intakeYear">Intake Year *</Label>
                  </div>
                  <Select onValueChange={(value) => setValue('intakeYear', value)}>
                    <SelectTrigger className={errors.intakeYear ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {intakeYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.intakeYear && (
                    <p className="text-sm text-destructive">{errors.intakeYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="intakeSemester">Intake Semester *</Label>
                  </div>
                  <Select onValueChange={(value) => setValue('intakeSemester', value)}>
                    <SelectTrigger className={errors.intakeSemester ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {intakeSemesters.map((semester) => (
                        <SelectItem key={semester.value} value={semester.value}>
                          {semester.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.intakeSemester && (
                    <p className="text-sm text-destructive">{errors.intakeSemester.message}</p>
                  )}
                </div>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Declaration Section */}
          <motion.div variants={fadeIn}>
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-lg">Declaration & Terms</CardTitle>
                <CardDescription>
                  Please read and accept the following before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="declarationAccurate"
                    checked={declarationAccurate}
                    onCheckedChange={(checked) => setValue('declarationAccurate', checked as boolean)}
                  />
                  <Label
                    htmlFor="declarationAccurate"
                    className="text-sm font-normal leading-relaxed cursor-pointer"
                  >
                    I declare that all the information provided in this application is true and
                    accurate to the best of my knowledge. I understand that providing false
                    information may result in the rejection of my application or cancellation of
                    registration.
                  </Label>
                </div>
                {errors.declarationAccurate && (
                  <p className="text-sm text-destructive ml-7">
                    {errors.declarationAccurate.message}
                  </p>
                )}

                <Separator />

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm font-normal leading-relaxed cursor-pointer"
                  >
                    I have read and accept the{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      Privacy Policy
                    </a>{' '}
                    of the University of the Western Cape.
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive ml-7">{errors.acceptTerms.message}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/application/tertiary-education')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
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
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Application
            </Button>
          </motion.div>
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Application Submission</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit your application? Once submitted, you will not be
                able to make changes to certain sections.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Application Summary:</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Faculty:</span> {formData?.faculty}
                  </p>
                  <p>
                    <span className="text-muted-foreground">First Choice:</span>{' '}
                    {formData?.firstChoice}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Study Mode:</span>{' '}
                    {studyModes.find((m) => m.value === formData?.studyMode)?.label}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Campus:</span>{' '}
                    {campuses.find((c) => c.value === formData?.campus)?.label}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Intake:</span>{' '}
                    {formData?.intakeYear}{' '}
                    {intakeSemesters.find((s) => s.value === formData?.intakeSemester)?.label}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </PageContainer>
  )
}
