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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { demographicSchema, type DemographicInfo } from '@/lib/validations'
import { homeLanguages, races, citizenshipOptions, applications } from '@/lib/data'

export function DemographicInformationPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()
  
  const draftApplication = applications.find(app => app.status === 'draft')
  const existingData = draftApplication?.demographicInfo

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicInfo>({
    resolver: zodResolver(demographicSchema),
    defaultValues: (existingData as DemographicInfo) || {
      nationality: 'South African',
      homeLanguage: '',
      race: '',
      disability: undefined,
      disabilityType: '',
      citizenship: undefined,
    },
  })

  const hasDisability = watch('disability')

  const onSubmit = async (data: DemographicInfo) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form data:', data)
      saveDraft('demographic-information', data)
      completeStep('demographic-information')
      toast.success('Demographic information saved successfully')
      navigate('/application/contact-details')
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
      title="Demographic Information"
      description="Please provide your demographic details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nationality"
                  required
                >
                  <Select
                    onValueChange={(value) => setValue('nationality', value)}
                    defaultValue="South African"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="South African">South African</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Home Language"
                  required
                  error={errors.homeLanguage?.message}
                >
                  <Select
                    onValueChange={(value) => setValue('homeLanguage', value)}
                    defaultValue={existingData?.homeLanguage}
                  >
                    <SelectTrigger error={!!errors.homeLanguage}>
                      <SelectValue placeholder="Select your home language" />
                    </SelectTrigger>
                    <SelectContent>
                      {homeLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Race"
                  required
                  tooltip="This information is required for statistical purposes"
                  error={errors.race?.message}
                >
                  <Select
                    onValueChange={(value) => setValue('race', value)}
                    defaultValue={existingData?.race}
                  >
                    <SelectTrigger error={!!errors.race}>
                      <SelectValue placeholder="Select your race" />
                    </SelectTrigger>
                    <SelectContent>
                      {races.map((race) => (
                        <SelectItem key={race.value} value={race.value}>
                          {race.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Citizenship Status"
                  required
                  error={errors.citizenship?.message}
                >
                  <Select
                    onValueChange={(value) => setValue('citizenship', value as 'citizen' | 'permanent_resident' | 'international')}
                    defaultValue={existingData?.citizenship}
                  >
                    <SelectTrigger error={!!errors.citizenship}>
                      <SelectValue placeholder="Select citizenship status" />
                    </SelectTrigger>
                    <SelectContent>
                      {citizenshipOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Do you have a disability?"
                required
                error={errors.disability?.message}
              >
                <Select
                  onValueChange={(value) => setValue('disability', value as 'yes' | 'no')}
                  defaultValue={existingData?.disability}
                >
                  <SelectTrigger error={!!errors.disability}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              {hasDisability === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FormField
                    label="Type of Disability"
                    tooltip="Please describe your disability"
                  >
                    <Select
                      onValueChange={(value) => setValue('disabilityType', value)}
                      defaultValue={existingData?.disabilityType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type of disability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual Impairment</SelectItem>
                        <SelectItem value="hearing">Hearing Impairment</SelectItem>
                        <SelectItem value="physical">Physical Disability</SelectItem>
                        <SelectItem value="learning">Learning Disability</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between gap-4"
        >
          <Link to="/application/personal-information">
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
