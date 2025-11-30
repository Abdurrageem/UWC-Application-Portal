import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Info, Upload, FileText, X } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn, slideUp } from '@/lib/animations'
import { toast } from 'sonner'

const matricExamSchema = z.object({
  examBoard: z.string().min(1, 'Exam board is required'),
  examYear: z.string().min(1, 'Exam year is required'),
  certificateNumber: z.string().optional(),
  schoolName: z.string().min(1, 'School name is required'),
  schoolEmisNumber: z.string().optional(),
  province: z.string().min(1, 'Province is required'),
  examinationType: z.string().min(1, 'Examination type is required'),
  hasMatricExemption: z.boolean().default(false),
  exemptionNumber: z.string().optional(),
  isResultPending: z.boolean().default(false),
})

type MatricExamFormValues = z.infer<typeof matricExamSchema>

const examBoards = [
  'Department of Basic Education (DBE)',
  'Independent Examinations Board (IEB)',
  'South African Comprehensive Assessment Institute (SACAI)',
  'Umalusi',
  'Cambridge International',
  'International Baccalaureate (IB)',
  'Other',
]

const examYears = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())

const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
]

const examinationTypes = [
  'National Senior Certificate (NSC)',
  'Senior Certificate (SC)',
  'National Certificate Vocational (NCV)',
  'Cambridge AS/A Levels',
  'International Baccalaureate Diploma',
  'GED Certificate',
  'Other',
]

const steps = [
  { label: 'Personal Info', path: '/application/personal-information' },
  { label: 'Demographics', path: '/application/demographic-information' },
  { label: 'Matric Details', path: '/application/matric-exam-details' },
  { label: 'Subjects', path: '/application/matric-subjects' },
  { label: 'Tertiary', path: '/application/tertiary-education' },
  { label: 'Program', path: '/application/program-selection' },
]

export function MatricExamDetailsPage() {
  const navigate = useNavigate()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MatricExamFormValues>({
    resolver: zodResolver(matricExamSchema),
    defaultValues: {
      examBoard: '',
      examYear: '',
      certificateNumber: '',
      schoolName: '',
      schoolEmisNumber: '',
      province: '',
      examinationType: '',
      hasMatricExemption: false,
      exemptionNumber: '',
      isResultPending: false,
    },
  })

  const hasExemption = watch('hasMatricExemption')
  const isResultPending = watch('isResultPending')

  const onSubmit = async (data: MatricExamFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      console.log('Uploaded files:', uploadedFiles)
      saveDraft('matric-exam-details', data)
      completeStep('matric-exam-details')
      toast.success('Matric exam details saved successfully!')
      navigate('/application/matric-subjects')
    } catch (error) {
      toast.error('Failed to save matric exam details. Please try again.')
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      const validFiles = fileArray.filter((file) => {
        const maxSize = 5 * 1024 * 1024 // 5MB
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
        if (file.size > maxSize) {
          toast.error(`${file.name} exceeds 5MB limit`)
          return false
        }
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a valid file type`)
          return false
        }
        return true
      })
      setUploadedFiles((prev) => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) uploaded`)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    toast.info('File removed')
  }

  return (
    <PageContainer
      title="Matric Examination Details"
      description="Provide information about your matric examination"
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
          <ProgressBar steps={steps} currentStep={2} />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Exam Board and Year Section */}
          <motion.div variants={slideUp}>
            <FormSectionCard
              title="Examination Information"
              description="Select your examination board and year"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="examBoard">Examination Board *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the examination board that administered your matric exams</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    onValueChange={(value) => setValue('examBoard', value)}
                  >
                    <SelectTrigger className={errors.examBoard ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select examination board" />
                    </SelectTrigger>
                    <SelectContent>
                      {examBoards.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.examBoard && (
                    <p className="text-sm text-destructive">{errors.examBoard.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examYear">Examination Year *</Label>
                  <Select
                    onValueChange={(value) => setValue('examYear', value)}
                  >
                    <SelectTrigger className={errors.examYear ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {examYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.examYear && (
                    <p className="text-sm text-destructive">{errors.examYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examinationType">Examination Type *</Label>
                  <Select
                    onValueChange={(value) => setValue('examinationType', value)}
                  >
                    <SelectTrigger className={errors.examinationType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select examination type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examinationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.examinationType && (
                    <p className="text-sm text-destructive">{errors.examinationType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificateNumber">Certificate/Candidate Number</Label>
                  <Input
                    id="certificateNumber"
                    placeholder="Enter certificate number"
                    {...register('certificateNumber')}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="isResultPending"
                  checked={isResultPending}
                  onCheckedChange={(checked) => setValue('isResultPending', checked as boolean)}
                />
                <Label htmlFor="isResultPending" className="text-sm font-normal cursor-pointer">
                  My results are still pending
                </Label>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* School Information Section */}
          <motion.div variants={slideUp}>
            <FormSectionCard
              title="School Information"
              description="Provide details about the school where you completed matric"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    placeholder="Enter your school name"
                    className={errors.schoolName ? 'border-destructive' : ''}
                    {...register('schoolName')}
                  />
                  {errors.schoolName && (
                    <p className="text-sm text-destructive">{errors.schoolName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="schoolEmisNumber">EMIS Number</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Education Management Information System number (if known)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="schoolEmisNumber"
                    placeholder="Enter EMIS number (optional)"
                    {...register('schoolEmisNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Select
                    onValueChange={(value) => setValue('province', value)}
                  >
                    <SelectTrigger className={errors.province ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-sm text-destructive">{errors.province.message}</p>
                  )}
                </div>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Matric Exemption Section */}
          <motion.div variants={slideUp}>
            <FormSectionCard
              title="Matric Exemption"
              description="Do you have a matric exemption certificate?"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasMatricExemption"
                    checked={hasExemption}
                    onCheckedChange={(checked) => setValue('hasMatricExemption', checked as boolean)}
                  />
                  <Label htmlFor="hasMatricExemption" className="text-sm font-normal cursor-pointer">
                    I have a matric exemption certificate
                  </Label>
                </div>

                {hasExemption && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="exemptionNumber">Exemption Certificate Number</Label>
                    <Input
                      id="exemptionNumber"
                      placeholder="Enter exemption number"
                      {...register('exemptionNumber')}
                    />
                  </motion.div>
                )}
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Document Upload Section */}
          <motion.div variants={slideUp}>
            <FormSectionCard
              title="Supporting Documents"
              description="Upload your matric certificate or statement of results"
            >
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, JPG, PNG up to 5MB each
                    </span>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    {uploadedFiles.map((file, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
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
                onClick={() => navigate('/application/next-of-kin')}
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
