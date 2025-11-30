import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Wallet, Building, User, MapPin } from 'lucide-react'
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

const financialInfoSchema = z.object({
  // Sponsor Details
  sponsorType: z.string().optional(),
  sponsorTitle: z.string().optional(),
  sponsorInitials: z.string().optional(),
  sponsorSurname: z.string().optional(),
  sponsorFirstName: z.string().optional(),
  
  // Organization (if applicable)
  organizationName: z.string().optional(),
  
  // Sponsor Address
  sponsorStreetNumber: z.string().optional(),
  sponsorStreetName: z.string().optional(),
  sponsorSuburb: z.string().optional(),
  sponsorTown: z.string().optional(),
  sponsorCountry: z.string().optional(),
  sponsorPostalCode: z.string().optional(),
  
  // Sponsor Contact
  sponsorPhone: z.string().optional(),
  sponsorFax: z.string().optional(),
  sponsorCell: z.string().optional(),
  sponsorEmail: z.string().email().optional().or(z.literal('')),
  
  // Employment Details
  employerName: z.string().optional(),
  occupation: z.string().optional(),
  employerStreetNumber: z.string().optional(),
  employerStreetName: z.string().optional(),
  employerSuburb: z.string().optional(),
  employerTown: z.string().optional(),
  employerPostalCode: z.string().optional(),
  
  // Self-funded
  isSelfFunded: z.boolean().default(false),
}).superRefine((data, ctx) => {
  // Only require sponsorType if not self-funded
  if (!data.isSelfFunded && (!data.sponsorType || data.sponsorType.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Sponsor type is required',
      path: ['sponsorType'],
    })
  }
})

type FinancialInfoFormValues = z.infer<typeof financialInfoSchema>

const sponsorTypes = [
  'Parent',
  'Guardian',
  'Self',
  'Employer',
  'Bursary/Scholarship',
  'Government',
  'Other',
]

const titles = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Rev', 'Other']

const countries = [
  'South Africa',
  'Botswana',
  'Lesotho',
  'Mozambique',
  'Namibia',
  'Eswatini',
  'Zimbabwe',
  'Other African Country',
  'Other International',
]

const steps = [
  { label: 'Program', path: '/application/program-details' },
  { label: 'Personal', path: '/application/personal-information' },
  { label: 'Contact', path: '/application/contact-details' },
  { label: 'Next of Kin', path: '/application/next-of-kin' },
  { label: 'Financial', path: '/application/financial-information' },
  { label: 'Documents', path: '/application/document-upload' },
]

export function FinancialInformationPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FinancialInfoFormValues>({
    resolver: zodResolver(financialInfoSchema),
    defaultValues: {
      isSelfFunded: false,
    },
  })

  const sponsorType = watch('sponsorType')
  const isSelfFunded = watch('isSelfFunded')

  const onSubmit = async (data: FinancialInfoFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('financial-information', data)
      completeStep('financial-information')
      toast.success('Financial information saved successfully!')
      navigate('/application/grants-scholarships')
    } catch {
      toast.error('Failed to save financial information. Please try again.')
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

  const showPersonalSponsor = sponsorType && ['Parent', 'Guardian', 'Other'].includes(sponsorType)
  const showOrganization = sponsorType && ['Employer', 'Bursary/Scholarship', 'Government'].includes(sponsorType)

  return (
    <PageContainer
      title="Financial Information"
      description="Provide details about how your studies will be funded"
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
          {/* Self-Funded Option */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Funding Source"
              description="How will your studies be funded?"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Select your funding arrangement</span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Checkbox
                  id="isSelfFunded"
                  checked={isSelfFunded}
                  onCheckedChange={(checked: boolean) => setValue('isSelfFunded', checked)}
                />
                <Label htmlFor="isSelfFunded" className="cursor-pointer">
                  I will be funding my own studies
                </Label>
              </div>

              {!isSelfFunded && (
                <div className="max-w-xs">
                  <Label>Sponsor Type *</Label>
                  <Select onValueChange={(value: string) => setValue('sponsorType', value)}>
                    <SelectTrigger className={errors.sponsorType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select sponsor type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sponsorTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sponsorType && (
                    <p className="text-sm text-destructive mt-1">{errors.sponsorType.message}</p>
                  )}
                </div>
              )}
            </FormSectionCard>
          </motion.div>

          {/* Personal Sponsor Details */}
          {showPersonalSponsor && !isSelfFunded && (
            <motion.div
              variants={fadeIn}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FormSectionCard
                title="Sponsor Personal Details"
                description="Information about the person sponsoring your studies"
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sponsor Information</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Select onValueChange={(value: string) => setValue('sponsorTitle', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {titles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorInitials">Initials</Label>
                    <Input
                      id="sponsorInitials"
                      placeholder="J"
                      {...register('sponsorInitials')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorFirstName">First Name</Label>
                    <Input
                      id="sponsorFirstName"
                      placeholder="John"
                      {...register('sponsorFirstName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorSurname">Surname</Label>
                    <Input
                      id="sponsorSurname"
                      placeholder="Doe"
                      {...register('sponsorSurname')}
                    />
                  </div>
                </div>
              </FormSectionCard>
            </motion.div>
          )}

          {/* Organization Details */}
          {showOrganization && !isSelfFunded && (
            <motion.div
              variants={fadeIn}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FormSectionCard
                title="Organization Details"
                description="Information about the sponsoring organization"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Organization Information</span>
                </div>

                <div className="space-y-2 max-w-md">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    placeholder="Company/Organization Name"
                    {...register('organizationName')}
                  />
                </div>
              </FormSectionCard>
            </motion.div>
          )}

          {/* Sponsor Address */}
          {sponsorType && !isSelfFunded && sponsorType !== 'Self' && (
            <motion.div
              variants={fadeIn}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FormSectionCard
                title="Sponsor Address"
                description="Residential address of sponsor"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Full Address</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorStreetNumber">Street Number</Label>
                    <Input
                      id="sponsorStreetNumber"
                      placeholder="123"
                      {...register('sponsorStreetNumber')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorStreetName">Street Name</Label>
                    <Input
                      id="sponsorStreetName"
                      placeholder="Main Street"
                      {...register('sponsorStreetName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorSuburb">Suburb</Label>
                    <Input
                      id="sponsorSuburb"
                      placeholder="Suburb"
                      {...register('sponsorSuburb')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorTown">Town/City</Label>
                    <Input
                      id="sponsorTown"
                      placeholder="Cape Town"
                      {...register('sponsorTown')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select onValueChange={(value: string) => setValue('sponsorCountry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorPostalCode">Postal Code</Label>
                    <Input
                      id="sponsorPostalCode"
                      placeholder="7535"
                      {...register('sponsorPostalCode')}
                    />
                  </div>
                </div>

                {/* Sponsor Contact */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Contact Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sponsorPhone">Phone</Label>
                      <Input
                        id="sponsorPhone"
                        type="tel"
                        placeholder="+27 21 123 4567"
                        {...register('sponsorPhone')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sponsorFax">Fax</Label>
                      <Input
                        id="sponsorFax"
                        type="tel"
                        placeholder="+27 21 123 4568"
                        {...register('sponsorFax')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sponsorCell">Cell Phone</Label>
                      <Input
                        id="sponsorCell"
                        type="tel"
                        placeholder="+27 82 123 4567"
                        {...register('sponsorCell')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sponsorEmail">Email</Label>
                      <Input
                        id="sponsorEmail"
                        type="email"
                        placeholder="sponsor@example.com"
                        {...register('sponsorEmail')}
                      />
                    </div>
                  </div>
                </div>
              </FormSectionCard>
            </motion.div>
          )}

          {/* Employment Details */}
          {sponsorType && !isSelfFunded && (sponsorType === 'Parent' || sponsorType === 'Guardian') && (
            <motion.div
              variants={fadeIn}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FormSectionCard
                title="Sponsor Employment Details"
                description="Employment information of sponsor (optional)"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Employment Information</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      placeholder="Company Name"
                      {...register('employerName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Job Title"
                      {...register('occupation')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerStreetNumber">Street Number</Label>
                    <Input
                      id="employerStreetNumber"
                      placeholder="123"
                      {...register('employerStreetNumber')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerStreetName">Street Name</Label>
                    <Input
                      id="employerStreetName"
                      placeholder="Business Street"
                      {...register('employerStreetName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerSuburb">Suburb</Label>
                    <Input
                      id="employerSuburb"
                      placeholder="Suburb"
                      {...register('employerSuburb')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerTown">Town/City</Label>
                    <Input
                      id="employerTown"
                      placeholder="Cape Town"
                      {...register('employerTown')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerPostalCode">Postal Code</Label>
                    <Input
                      id="employerPostalCode"
                      placeholder="7535"
                      {...register('employerPostalCode')}
                    />
                  </div>
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
                onClick={() => navigate('/application/tertiary-education')}
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
