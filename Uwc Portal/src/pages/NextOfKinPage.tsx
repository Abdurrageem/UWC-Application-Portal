import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Users, Phone, MapPin } from 'lucide-react'
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
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'

const nextOfKinSchema = z.object({
  // Personal Details
  title: z.string().min(1, 'Title is required'),
  initials: z.string().min(1, 'Initials are required'),
  surname: z.string().min(1, 'Surname is required'),
  firstName: z.string().min(1, 'First name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  
  // Address
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  suburb: z.string().min(1, 'Suburb is required'),
  town: z.string().min(1, 'Town/City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  
  // Contact Numbers
  homePhone: z.string().optional(),
  fax: z.string().optional(),
  cellPhone: z.string().min(1, 'Cell phone number is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
})

type NextOfKinFormValues = z.infer<typeof nextOfKinSchema>

const titles = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Rev', 'Other']

const relationships = [
  'Father',
  'Mother',
  'Guardian',
  'Spouse',
  'Sibling',
  'Grandparent',
  'Uncle',
  'Aunt',
  'Other',
]

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

export function NextOfKinPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NextOfKinFormValues>({
    resolver: zodResolver(nextOfKinSchema),
    defaultValues: {},
  })

  const onSubmit = async (data: NextOfKinFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('next-of-kin', data)
      completeStep('next-of-kin')
      toast.success('Next of kin details saved successfully!')
      navigate('/application/matric-exam-details')
    } catch {
      toast.error('Failed to save next of kin details. Please try again.')
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
      title="Next of Kin Contact Details"
      description="Provide emergency contact information"
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
          <ProgressBar steps={steps} currentStep={3} />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Details Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Personal Details"
              description="Enter your next of kin's personal information"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Emergency Contact Person</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Select onValueChange={(value: string) => setValue('title', value)}>
                    <SelectTrigger className={errors.title ? 'border-destructive' : ''}>
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
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initials">Initials *</Label>
                  <Input
                    id="initials"
                    placeholder="J"
                    className={errors.initials ? 'border-destructive' : ''}
                    {...register('initials')}
                  />
                  {errors.initials && (
                    <p className="text-sm text-destructive">{errors.initials.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className={errors.firstName ? 'border-destructive' : ''}
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname">Surname *</Label>
                  <Input
                    id="surname"
                    placeholder="Doe"
                    className={errors.surname ? 'border-destructive' : ''}
                    {...register('surname')}
                  />
                  {errors.surname && (
                    <p className="text-sm text-destructive">{errors.surname.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 max-w-xs">
                <Label>Relationship *</Label>
                <Select onValueChange={(value: string) => setValue('relationship', value)}>
                  <SelectTrigger className={errors.relationship ? 'border-destructive' : ''}>
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
                {errors.relationship && (
                  <p className="text-sm text-destructive">{errors.relationship.message}</p>
                )}
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Address Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Address"
              description="Next of kin's residential address"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Full Address</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="streetNumber">Street Number</Label>
                  <Input
                    id="streetNumber"
                    placeholder="123"
                    {...register('streetNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetName">Street Name</Label>
                  <Input
                    id="streetName"
                    placeholder="Main Street"
                    {...register('streetName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb *</Label>
                  <Input
                    id="suburb"
                    placeholder="Suburb"
                    className={errors.suburb ? 'border-destructive' : ''}
                    {...register('suburb')}
                  />
                  {errors.suburb && (
                    <p className="text-sm text-destructive">{errors.suburb.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="town">Town/City *</Label>
                  <Input
                    id="town"
                    placeholder="Cape Town"
                    className={errors.town ? 'border-destructive' : ''}
                    {...register('town')}
                  />
                  {errors.town && (
                    <p className="text-sm text-destructive">{errors.town.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select onValueChange={(value: string) => setValue('country', value)}>
                    <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
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
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    placeholder="7535"
                    className={errors.postalCode ? 'border-destructive' : ''}
                    {...register('postalCode')}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Contact Numbers Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Contact Numbers"
              description="Phone numbers and email for next of kin"
            >
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Contact Information</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="homePhone">Home Phone</Label>
                  <Input
                    id="homePhone"
                    type="tel"
                    placeholder="+27 21 123 4567"
                    {...register('homePhone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fax">Fax</Label>
                  <Input
                    id="fax"
                    type="tel"
                    placeholder="+27 21 123 4568"
                    {...register('fax')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cellPhone">Cell Phone *</Label>
                  <Input
                    id="cellPhone"
                    type="tel"
                    placeholder="+27 82 123 4567"
                    className={errors.cellPhone ? 'border-destructive' : ''}
                    {...register('cellPhone')}
                  />
                  {errors.cellPhone && (
                    <p className="text-sm text-destructive">{errors.cellPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@example.com"
                    className={errors.email ? 'border-destructive' : ''}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </FormSectionCard>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/application/contact-details')}
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
