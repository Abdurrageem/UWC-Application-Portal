import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useApplication } from '@/context'
import { PageContainer } from '@/components/PageContainer'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { personalInfoSchema, type PersonalInfo } from '@/lib/validations'
import { provinces, genders, applications } from '@/lib/data'

export function PersonalInformationPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()
  
  // Get existing data from draft application
  const draftApplication = applications.find(app => app.status === 'draft')
  const existingData = draftApplication?.personalInfo

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: (existingData as PersonalInfo) || {
      firstName: '',
      lastName: '',
      idNumber: '',
      dateOfBirth: '',
      gender: undefined,
      email: '',
      phone: '',
      alternativePhone: '',
      streetAddress: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
    },
  })

  const onSubmit = async (data: PersonalInfo) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('personal-information', data)
      completeStep('personal-information')
      toast.success('Personal information saved successfully')
      navigate('/application/demographic-information')
    } catch (error) {
      toast.error('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully')
  }

  return (
    <PageContainer
      title="Personal Information"
      description="Please provide your personal details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  required
                  error={errors.firstName?.message}
                >
                  <Input
                    {...register('firstName')}
                    placeholder="Enter your first name"
                    error={!!errors.firstName}
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  required
                  error={errors.lastName?.message}
                >
                  <Input
                    {...register('lastName')}
                    placeholder="Enter your last name"
                    error={!!errors.lastName}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="ID Number"
                  required
                  tooltip="Enter your 13-digit South African ID number"
                  error={errors.idNumber?.message}
                >
                  <Input
                    {...register('idNumber')}
                    placeholder="e.g., 9501015800087"
                    maxLength={13}
                    error={!!errors.idNumber}
                  />
                </FormField>

                <FormField
                  label="Date of Birth"
                  required
                  error={errors.dateOfBirth?.message}
                >
                  <Input
                    type="date"
                    {...register('dateOfBirth')}
                    error={!!errors.dateOfBirth}
                  />
                </FormField>
              </div>

              <FormField
                label="Gender"
                required
                error={errors.gender?.message}
              >
                <Select
                  onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
                  defaultValue={existingData?.gender}
                >
                  <SelectTrigger error={!!errors.gender}>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                label="Email Address"
                required
                error={errors.email?.message}
              >
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email address"
                  error={!!errors.email}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Phone Number"
                  required
                  error={errors.phone?.message}
                >
                  <Input
                    {...register('phone')}
                    placeholder="e.g., 0821234567"
                    error={!!errors.phone}
                  />
                </FormField>

                <FormField
                  label="Alternative Phone"
                  tooltip="Optional secondary contact number"
                >
                  <Input
                    {...register('alternativePhone')}
                    placeholder="e.g., 0821234567"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Residential Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                label="Street Address"
                required
                error={errors.streetAddress?.message}
              >
                <Input
                  {...register('streetAddress')}
                  placeholder="Enter your street address"
                  error={!!errors.streetAddress}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Suburb"
                  required
                  error={errors.suburb?.message}
                >
                  <Input
                    {...register('suburb')}
                    placeholder="Enter your suburb"
                    error={!!errors.suburb}
                  />
                </FormField>

                <FormField
                  label="City"
                  required
                  error={errors.city?.message}
                >
                  <Input
                    {...register('city')}
                    placeholder="Enter your city"
                    error={!!errors.city}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Province"
                  required
                  error={errors.province?.message}
                >
                  <Select
                    onValueChange={(value) => setValue('province', value)}
                    defaultValue={existingData?.province}
                  >
                    <SelectTrigger error={!!errors.province}>
                      <SelectValue placeholder="Select your province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Postal Code"
                  required
                  error={errors.postalCode?.message}
                >
                  <Input
                    {...register('postalCode')}
                    placeholder="e.g., 7530"
                    maxLength={6}
                    error={!!errors.postalCode}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between gap-4"
        >
          <Link to="/application">
            <Button type="button" variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </form>
    </PageContainer>
  )
}
