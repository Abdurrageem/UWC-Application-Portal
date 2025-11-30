import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, MapPin, Phone, Mail } from 'lucide-react'
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

const contactDetailsSchema = z.object({
  // Postal Address
  postalStreetNumber: z.string().optional(),
  postalStreetName: z.string().optional(),
  postalBoxNumber: z.string().optional(),
  postalSuburb: z.string().min(1, 'Suburb is required'),
  postalTown: z.string().min(1, 'Town/City is required'),
  postalCountry: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  
  // Contact Numbers
  homePhone: z.string().optional(),
  fax: z.string().optional(),
  cellPhone: z.string().min(1, 'Cell phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  
  // Residential Address
  sameAsPostal: z.boolean().default(false),
  residentialStreetNumber: z.string().optional(),
  residentialStreetName: z.string().optional(),
  residentialSuburb: z.string().optional(),
  residentialTown: z.string().optional(),
  residentialCountry: z.string().optional(),
  residentialPostalCode: z.string().optional(),
})

type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>

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

export function ContactDetailsPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactDetailsFormValues>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      sameAsPostal: false,
    },
  })

  const sameAsPostal = watch('sameAsPostal')
  const postalSuburb = watch('postalSuburb')
  const postalTown = watch('postalTown')
  const postalCountry = watch('postalCountry')
  const postalCode = watch('postalCode')
  const postalStreetNumber = watch('postalStreetNumber')
  const postalStreetName = watch('postalStreetName')

  const handleSameAsPostalChange = (checked: boolean) => {
    setValue('sameAsPostal', checked)
    if (checked) {
      setValue('residentialStreetNumber', postalStreetNumber)
      setValue('residentialStreetName', postalStreetName)
      setValue('residentialSuburb', postalSuburb)
      setValue('residentialTown', postalTown)
      setValue('residentialCountry', postalCountry)
      setValue('residentialPostalCode', postalCode)
    }
  }

  const onSubmit = async (data: ContactDetailsFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('contact-details', data)
      completeStep('contact-details')
      toast.success('Contact details saved successfully!')
      navigate('/application/next-of-kin')
    } catch {
      toast.error('Failed to save contact details. Please try again.')
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
      title="Contact Details"
      description="Provide your contact information"
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
          {/* Postal Address Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Postal Address"
              description="Enter your postal address details"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Postal/Mailing Address</span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postalStreetNumber">Street Number</Label>
                  <Input
                    id="postalStreetNumber"
                    placeholder="123"
                    {...register('postalStreetNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalStreetName">Street Name</Label>
                  <Input
                    id="postalStreetName"
                    placeholder="Main Street"
                    {...register('postalStreetName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalBoxNumber">P.O. Box Number</Label>
                  <Input
                    id="postalBoxNumber"
                    placeholder="P.O. Box 123"
                    {...register('postalBoxNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalSuburb">Suburb *</Label>
                  <Input
                    id="postalSuburb"
                    placeholder="Suburb"
                    className={errors.postalSuburb ? 'border-destructive' : ''}
                    {...register('postalSuburb')}
                  />
                  {errors.postalSuburb && (
                    <p className="text-sm text-destructive">{errors.postalSuburb.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalTown">Town/City *</Label>
                  <Input
                    id="postalTown"
                    placeholder="Cape Town"
                    className={errors.postalTown ? 'border-destructive' : ''}
                    {...register('postalTown')}
                  />
                  {errors.postalTown && (
                    <p className="text-sm text-destructive">{errors.postalTown.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select onValueChange={(value: string) => setValue('postalCountry', value)}>
                    <SelectTrigger className={errors.postalCountry ? 'border-destructive' : ''}>
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
                  {errors.postalCountry && (
                    <p className="text-sm text-destructive">{errors.postalCountry.message}</p>
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
              description="Provide your phone numbers and email"
            >
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Phone & Email</span>
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
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email">Email Address *</Label>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
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

          {/* Residential Address Section */}
          <motion.div variants={fadeIn}>
            <FormSectionCard
              title="Residential Address"
              description="Your physical residential address"
            >
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="sameAsPostal"
                  checked={sameAsPostal}
                  onCheckedChange={handleSameAsPostalChange}
                />
                <Label htmlFor="sameAsPostal" className="cursor-pointer">
                  Same as postal address
                </Label>
              </div>

              {!sameAsPostal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="residentialStreetNumber">Street Number</Label>
                    <Input
                      id="residentialStreetNumber"
                      placeholder="123"
                      {...register('residentialStreetNumber')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residentialStreetName">Street Name</Label>
                    <Input
                      id="residentialStreetName"
                      placeholder="Main Street"
                      {...register('residentialStreetName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residentialSuburb">Suburb</Label>
                    <Input
                      id="residentialSuburb"
                      placeholder="Suburb"
                      {...register('residentialSuburb')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residentialTown">Town/City</Label>
                    <Input
                      id="residentialTown"
                      placeholder="Cape Town"
                      {...register('residentialTown')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select onValueChange={(value: string) => setValue('residentialCountry', value)}>
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
                    <Label htmlFor="residentialPostalCode">Postal Code</Label>
                    <Input
                      id="residentialPostalCode"
                      placeholder="7535"
                      {...register('residentialPostalCode')}
                    />
                  </div>
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
                onClick={() => navigate('/application/demographic-information')}
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
