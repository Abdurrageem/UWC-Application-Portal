import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, GraduationCap, Building2 } from 'lucide-react'
import { useState } from 'react'
import { useApplication } from '@/context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn, staggerContainer, staggerItem } from '@/lib/animations'
import { toast } from 'sonner'

const tertiaryQualificationSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  qualificationType: z.string().min(1, 'Qualification type is required'),
  qualificationName: z.string().min(1, 'Qualification name is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endYear: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  studentNumber: z.string().optional(),
})

const tertiaryEducationSchema = z.object({
  hasTertiaryEducation: z.boolean().default(false),
  qualifications: z.array(tertiaryQualificationSchema).optional(),
  additionalInfo: z.string().optional(),
})

type TertiaryEducationFormValues = z.infer<typeof tertiaryEducationSchema>

const qualificationTypes = [
  'Higher Certificate',
  'Advanced Certificate',
  'Diploma',
  'Advanced Diploma',
  'Bachelor\'s Degree',
  'Bachelor Honours Degree',
  'Postgraduate Diploma',
  'Master\'s Degree',
  'Doctoral Degree',
  'Other',
]

const qualificationStatuses = [
  'Completed',
  'In Progress',
  'Incomplete',
  'Deferred',
  'Withdrawn',
]

const fieldsOfStudy = [
  'Accounting',
  'Agriculture',
  'Architecture',
  'Arts & Design',
  'Biological Sciences',
  'Business Administration',
  'Commerce',
  'Communication Studies',
  'Computer Science',
  'Economics',
  'Education',
  'Engineering',
  'Environmental Science',
  'Health Sciences',
  'Humanities',
  'Information Technology',
  'Law',
  'Mathematics',
  'Medicine',
  'Natural Sciences',
  'Nursing',
  'Pharmacy',
  'Physical Sciences',
  'Psychology',
  'Social Sciences',
  'Sport Science',
  'Other',
]

const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString())

const steps = [
  { label: 'Personal Info', path: '/application/personal-information' },
  { label: 'Demographics', path: '/application/demographic-information' },
  { label: 'Matric Details', path: '/application/matric-exam-details' },
  { label: 'Subjects', path: '/application/matric-subjects' },
  { label: 'Tertiary', path: '/application/tertiary-education' },
  { label: 'Program', path: '/application/program-selection' },
]

export function TertiaryEducationPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<TertiaryEducationFormValues>({
    resolver: zodResolver(tertiaryEducationSchema),
    defaultValues: {
      hasTertiaryEducation: false,
      qualifications: [],
      additionalInfo: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'qualifications',
  })

  const hasTertiaryEducation = watch('hasTertiaryEducation')

  const addQualification = () => {
    append({
      institutionName: '',
      qualificationType: '',
      qualificationName: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      status: '',
      studentNumber: '',
    })
  }

  const onSubmit = async (data: TertiaryEducationFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('tertiary-education', data)
      completeStep('tertiary-education')
      toast.success('Tertiary education details saved successfully!')
      navigate('/application/financial-information')
    } catch (error) {
      toast.error('Failed to save tertiary education details. Please try again.')
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
    } catch (error) {
      toast.error('Failed to save progress.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer
      title="Tertiary Education"
      description="Provide information about any previous or current tertiary education"
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
          <ProgressBar steps={steps} currentStep={4} />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Has Tertiary Education Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Previous Tertiary Education"
              description="Have you attended any tertiary institution before?"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTertiaryEducation"
                  checked={hasTertiaryEducation}
                  onCheckedChange={(checked) => {
                    setValue('hasTertiaryEducation', checked as boolean)
                    if (!checked) {
                      setValue('qualifications', [])
                    }
                  }}
                />
                <Label htmlFor="hasTertiaryEducation" className="text-sm font-normal cursor-pointer">
                  Yes, I have previous tertiary education
                </Label>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Qualifications Section */}
          {hasTertiaryEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <FormSectionCard
                title="Qualifications"
                description="Add all tertiary qualifications you have obtained or are currently pursuing"
              >
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  {fields.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No qualifications added yet</p>
                      <Button type="button" variant="outline" onClick={addQualification}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Qualification
                      </Button>
                    </div>
                  ) : (
                    <>
                      {fields.map((field, index) => (
                        <motion.div key={field.id} variants={staggerItem}>
                          <Card className="relative">
                            <CardContent className="pt-6">
                              <div className="absolute top-4 right-4">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  className="text-destructive hover:text-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-2 mb-4">
                                <Building2 className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold">Qualification {index + 1}</h4>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                  <Label htmlFor={`qualifications.${index}.institutionName`}>
                                    Institution Name *
                                  </Label>
                                  <Input
                                    placeholder="e.g., University of Cape Town"
                                    {...register(`qualifications.${index}.institutionName`)}
                                    className={
                                      errors.qualifications?.[index]?.institutionName
                                        ? 'border-destructive'
                                        : ''
                                    }
                                  />
                                  {errors.qualifications?.[index]?.institutionName && (
                                    <p className="text-sm text-destructive">
                                      {errors.qualifications[index]?.institutionName?.message}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.qualificationType`}>
                                    Qualification Type *
                                  </Label>
                                  <Select
                                    onValueChange={(value) =>
                                      setValue(`qualifications.${index}.qualificationType`, value)
                                    }
                                  >
                                    <SelectTrigger
                                      className={
                                        errors.qualifications?.[index]?.qualificationType
                                          ? 'border-destructive'
                                          : ''
                                      }
                                    >
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {qualificationTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.qualificationName`}>
                                    Qualification Name *
                                  </Label>
                                  <Input
                                    placeholder="e.g., Bachelor of Commerce"
                                    {...register(`qualifications.${index}.qualificationName`)}
                                    className={
                                      errors.qualifications?.[index]?.qualificationName
                                        ? 'border-destructive'
                                        : ''
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.fieldOfStudy`}>
                                    Field of Study *
                                  </Label>
                                  <Select
                                    onValueChange={(value) =>
                                      setValue(`qualifications.${index}.fieldOfStudy`, value)
                                    }
                                  >
                                    <SelectTrigger
                                      className={
                                        errors.qualifications?.[index]?.fieldOfStudy
                                          ? 'border-destructive'
                                          : ''
                                      }
                                    >
                                      <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {fieldsOfStudy.map((field) => (
                                        <SelectItem key={field} value={field}>
                                          {field}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.status`}>
                                    Status *
                                  </Label>
                                  <Select
                                    onValueChange={(value) =>
                                      setValue(`qualifications.${index}.status`, value)
                                    }
                                  >
                                    <SelectTrigger
                                      className={
                                        errors.qualifications?.[index]?.status
                                          ? 'border-destructive'
                                          : ''
                                      }
                                    >
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {qualificationStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                          {status}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.startYear`}>
                                    Start Year *
                                  </Label>
                                  <Select
                                    onValueChange={(value) =>
                                      setValue(`qualifications.${index}.startYear`, value)
                                    }
                                  >
                                    <SelectTrigger
                                      className={
                                        errors.qualifications?.[index]?.startYear
                                          ? 'border-destructive'
                                          : ''
                                      }
                                    >
                                      <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                          {year}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.endYear`}>
                                    End Year
                                  </Label>
                                  <Select
                                    onValueChange={(value) =>
                                      setValue(`qualifications.${index}.endYear`, value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select year (if completed)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                          {year}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`qualifications.${index}.studentNumber`}>
                                    Student Number
                                  </Label>
                                  <Input
                                    placeholder="Your student number"
                                    {...register(`qualifications.${index}.studentNumber`)}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}

                      <Button type="button" variant="outline" onClick={addQualification}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Qualification
                      </Button>
                    </>
                  )}
                </motion.div>
              </FormSectionCard>

              {/* Additional Information */}
              <FormSectionCard
                title="Additional Information"
                description="Any other relevant information about your tertiary education"
              >
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Comments (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="e.g., reasons for incomplete studies, academic achievements, etc."
                    className="min-h-[100px]"
                    {...register('additionalInfo')}
                  />
                </div>
              </FormSectionCard>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/application/matric-subjects')}
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
