import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Award, DollarSign, CheckCircle } from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'

const grantsSchema = z.object({
  // Grant Application Status
  hasAppliedForGrant: z.boolean().default(false),
  grantName: z.string().optional(),
  grantValue: z.string().optional(),
  grantCoverage: z.string().optional(),
  grantApprovalStatus: z.string().optional(),
  
  // Financial Aid
  applyingForFinancialAid: z.boolean().default(false),
  nsfasApplicant: z.boolean().default(false),
  nsfasReferenceNumber: z.string().optional(),
  
  // Sponsor Forwarding
  sponsorForwardingRequired: z.boolean().default(false),
  sponsorForwardingDetails: z.string().optional(),
})

type GrantsFormValues = z.infer<typeof grantsSchema>

const coverageTypes = [
  'Full Tuition',
  'Partial Tuition',
  'Tuition + Accommodation',
  'Tuition + Allowance',
  'Full Bursary (All Expenses)',
]

const approvalStatuses = [
  'Approved',
  'Pending',
  'Awaiting Results',
  'Not Yet Applied',
]

const steps = [
  { label: 'Program', path: '/application/program-details' },
  { label: 'Personal', path: '/application/personal-information' },
  { label: 'Contact', path: '/application/contact-details' },
  { label: 'Next of Kin', path: '/application/next-of-kin' },
  { label: 'Financial', path: '/application/financial-information' },
  { label: 'Documents', path: '/application/document-upload' },
]

export function GrantsScholarshipsPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GrantsFormValues>({
    resolver: zodResolver(grantsSchema),
    defaultValues: {
      hasAppliedForGrant: false,
      applyingForFinancialAid: false,
      nsfasApplicant: false,
      sponsorForwardingRequired: false,
    },
  })

  const hasAppliedForGrant = watch('hasAppliedForGrant')
  const applyingForFinancialAid = watch('applyingForFinancialAid')
  const nsfasApplicant = watch('nsfasApplicant')
  const sponsorForwardingRequired = watch('sponsorForwardingRequired')

  const onSubmit = async (data: GrantsFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('grants-scholarships', data)
      completeStep('grants-scholarships')
      toast.success('Grants and scholarships information saved!')
      navigate('/application/document-upload')
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
      title="Grants, Scholarships & Bursaries"
      description="Provide information about any financial assistance you've applied for"
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
          {/* Grant Application */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Grant/Scholarship Application"
              description="Have you applied for any grants, scholarships, or bursaries?"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">External Funding</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Checkbox
                  id="hasAppliedForGrant"
                  checked={hasAppliedForGrant}
                  onCheckedChange={(checked: boolean) => setValue('hasAppliedForGrant', checked)}
                />
                <Label htmlFor="hasAppliedForGrant" className="cursor-pointer">
                  I have applied for or received a grant/scholarship/bursary
                </Label>
              </div>

              {hasAppliedForGrant && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="grantName">Grant/Scholarship Name</Label>
                    <Input
                      id="grantName"
                      placeholder="e.g., Merit Scholarship"
                      {...register('grantName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grantValue">Value (R)</Label>
                    <Input
                      id="grantValue"
                      type="text"
                      placeholder="e.g., 50000"
                      {...register('grantValue')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Coverage Type</Label>
                    <Select onValueChange={(value: string) => setValue('grantCoverage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        {coverageTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Approval Status</Label>
                    <Select onValueChange={(value: string) => setValue('grantApprovalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvalStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Financial Aid */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Financial Aid"
              description="Are you applying for financial aid?"
            >
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">University Financial Aid</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="applyingForFinancialAid"
                    checked={applyingForFinancialAid}
                    onCheckedChange={(checked: boolean) => setValue('applyingForFinancialAid', checked)}
                  />
                  <Label htmlFor="applyingForFinancialAid" className="cursor-pointer">
                    I wish to apply for UWC Financial Aid
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="nsfasApplicant"
                    checked={nsfasApplicant}
                    onCheckedChange={(checked: boolean) => setValue('nsfasApplicant', checked)}
                  />
                  <Label htmlFor="nsfasApplicant" className="cursor-pointer">
                    I have applied/will apply for NSFAS
                  </Label>
                </div>

                {nsfasApplicant && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md"
                  >
                    <Label htmlFor="nsfasReferenceNumber">NSFAS Reference Number (if available)</Label>
                    <Input
                      id="nsfasReferenceNumber"
                      placeholder="NSFAS reference number"
                      {...register('nsfasReferenceNumber')}
                    />
                  </motion.div>
                )}
              </div>

              {applyingForFinancialAid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Card className="bg-info-50 border-info-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-info-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-info-900">Financial Aid Information</p>
                          <p className="text-sm text-info-700 mt-1">
                            Financial aid applications are processed separately. You will be contacted by 
                            the Financial Aid Office after your application is received. Please ensure 
                            you submit all required documents.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Sponsor Forwarding */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Sponsor Forwarding"
              description="Does your sponsor require account statements to be forwarded?"
            >
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="sponsorForwardingRequired"
                  checked={sponsorForwardingRequired}
                  onCheckedChange={(checked: boolean) => setValue('sponsorForwardingRequired', checked)}
                />
                <Label htmlFor="sponsorForwardingRequired" className="cursor-pointer">
                  Yes, my sponsor requires account statements to be forwarded to them
                </Label>
              </div>

              {sponsorForwardingRequired && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="sponsorForwardingDetails">
                    Forwarding Details (Contact person, email, address)
                  </Label>
                  <Input
                    id="sponsorForwardingDetails"
                    placeholder="Enter contact details for statement forwarding"
                    className={errors.sponsorForwardingDetails ? 'border-destructive' : ''}
                    {...register('sponsorForwardingDetails')}
                  />
                </motion.div>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/application/financial-information')}
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
