import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, GraduationCap, Users, Megaphone } from 'lucide-react'
import { useState } from 'react'
import { useApplication } from '@/context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'

const alumniStaffSchema = z.object({
  // Parent Alumni Status
  parentIsAlumni: z.boolean().default(false),
  parentAlumniName: z.string().optional(),
  parentAlumniStudentNumber: z.string().optional(),
  parentAlumniQualification: z.string().optional(),
  parentAlumniYear: z.string().optional(),
  
  // Staff Status
  isRelatedToStaff: z.boolean().default(false),
  staffMemberName: z.string().optional(),
  staffMemberDepartment: z.string().optional(),
  staffRelationship: z.string().optional(),
  
  // Marketing Information
  howDidYouHear: z.string().min(1, 'Please tell us how you heard about UWC'),
  otherSource: z.string().optional(),
})

type AlumniStaffFormValues = z.infer<typeof alumniStaffSchema>

const hearAboutOptions = [
  'UWC Website',
  'Social Media (Facebook, Instagram, Twitter)',
  'School Career Guidance',
  'Open Day/Campus Visit',
  'Print Media (Newspapers, Magazines)',
  'Radio Advertisement',
  'Friend or Family',
  'Current UWC Student',
  'UWC Alumni',
  'Career Exhibition',
  'Online Search/Google',
  'Other',
]

const relationships = [
  'Father',
  'Mother',
  'Sibling',
  'Spouse',
  'Uncle',
  'Aunt',
  'Other',
]

const steps = [
  { label: 'Program', path: '/application/program-details' },
  { label: 'Personal', path: '/application/personal-information' },
  { label: 'Contact', path: '/application/contact-details' },
  { label: 'Next of Kin', path: '/application/next-of-kin' },
  { label: 'Financial', path: '/application/financial-information' },
  { label: 'Documents', path: '/application/document-upload' },
]

export function AlumniStaffPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AlumniStaffFormValues>({
    resolver: zodResolver(alumniStaffSchema),
    defaultValues: {
      parentIsAlumni: false,
      isRelatedToStaff: false,
    },
  })

  const parentIsAlumni = watch('parentIsAlumni')
  const isRelatedToStaff = watch('isRelatedToStaff')
  const howDidYouHear = watch('howDidYouHear')

  const onSubmit = async (data: AlumniStaffFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('alumni-staff', data)
      completeStep('alumni-staff')
      toast.success('Information saved successfully!')
      navigate('/application/agreement')
    } catch {
      toast.error('Failed to save information. Please try again.')
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
      title="Alumni, Staff & Marketing"
      description="Provide information about your connection to UWC"
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
          {/* Parent Alumni Status */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Parent/Guardian Alumni Status"
              description="Is your parent or guardian a UWC alumnus/alumna?"
            >
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">UWC Alumni Connection</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="parentIsAlumni"
                  checked={parentIsAlumni}
                  onCheckedChange={(checked: boolean) => setValue('parentIsAlumni', checked)}
                />
                <Label htmlFor="parentIsAlumni" className="cursor-pointer">
                  My parent/guardian is a UWC alumnus/alumna
                </Label>
              </div>

              {parentIsAlumni && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="parentAlumniName">Full Name</Label>
                    <Input
                      id="parentAlumniName"
                      placeholder="Parent/Guardian name"
                      {...register('parentAlumniName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentAlumniStudentNumber">Student Number (if known)</Label>
                    <Input
                      id="parentAlumniStudentNumber"
                      placeholder="e.g., 199012345"
                      {...register('parentAlumniStudentNumber')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentAlumniQualification">Qualification Obtained</Label>
                    <Input
                      id="parentAlumniQualification"
                      placeholder="e.g., BA, BCom, BSc"
                      {...register('parentAlumniQualification')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentAlumniYear">Year of Graduation</Label>
                    <Input
                      id="parentAlumniYear"
                      placeholder="e.g., 1995"
                      {...register('parentAlumniYear')}
                    />
                  </div>
                </motion.div>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Staff Relationship */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Staff Relationship"
              description="Are you related to a current UWC staff member?"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">UWC Staff Connection</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="isRelatedToStaff"
                  checked={isRelatedToStaff}
                  onCheckedChange={(checked: boolean) => setValue('isRelatedToStaff', checked)}
                />
                <Label htmlFor="isRelatedToStaff" className="cursor-pointer">
                  I am related to a current UWC staff member
                </Label>
              </div>

              {isRelatedToStaff && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="staffMemberName">Staff Member Name</Label>
                    <Input
                      id="staffMemberName"
                      placeholder="Full name of staff member"
                      {...register('staffMemberName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staffMemberDepartment">Department</Label>
                    <Input
                      id="staffMemberDepartment"
                      placeholder="Department/Faculty"
                      {...register('staffMemberDepartment')}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2 max-w-xs">
                    <Label>Relationship</Label>
                    <Select onValueChange={(value: string) => setValue('staffRelationship', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((rel) => (
                          <SelectItem key={rel} value={rel}>
                            {rel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Marketing Information */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="How Did You Hear About UWC?"
              description="Help us improve our outreach by telling us how you found us"
            >
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Marketing Information</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 max-w-md">
                  <Label>How did you hear about UWC? *</Label>
                  <Select onValueChange={(value: string) => setValue('howDidYouHear', value)}>
                    <SelectTrigger className={errors.howDidYouHear ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {hearAboutOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.howDidYouHear && (
                    <p className="text-sm text-destructive">{errors.howDidYouHear.message}</p>
                  )}
                </div>

                {howDidYouHear === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 max-w-md"
                  >
                    <Label htmlFor="otherSource">Please specify</Label>
                    <Input
                      id="otherSource"
                      placeholder="How did you hear about UWC?"
                      {...register('otherSource')}
                    />
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
                onClick={() => navigate('/application/document-upload')}
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
