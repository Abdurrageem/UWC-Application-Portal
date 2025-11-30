import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import { useApplication } from '@/context'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'

const steps = [
  { label: 'Program', path: '/application/program-details' },
  { label: 'Personal', path: '/application/personal-information' },
  { label: 'Contact', path: '/application/contact-details' },
  { label: 'Next of Kin', path: '/application/next-of-kin' },
  { label: 'Financial', path: '/application/financial-information' },
  { label: 'Documents', path: '/application/document-upload' },
]

export function AgreementPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeStep, saveDraft } = useApplication()
  const [agreements, setAgreements] = useState({
    legalUndertaking: false,
    accessToInformation: false,
    dataProtection: false,
    academicHonesty: false,
  })

  const allAgreed = Object.values(agreements).every(Boolean)

  const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
    setAgreements((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSubmit = async () => {
    if (!allAgreed) {
      toast.error('Please accept all agreements to continue')
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      saveDraft('agreement', { agreements })
      completeStep('agreement')
      toast.success('Application submitted successfully!')
      navigate('/application/close')
    } catch {
      toast.error('Failed to submit application. Please try again.')
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
      title="Declaration & Agreement"
      description="Please read and accept the following declarations"
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

        {/* Important Notice */}
        <motion.div variants={fadeIn}>
          <Card className="bg-warning-50 border-warning-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
                <div>
                  <p className="font-medium text-warning-900">Important Notice</p>
                  <p className="text-sm text-warning-700 mt-1">
                    Please read the following declarations carefully before accepting. By submitting 
                    this application, you acknowledge that you understand and agree to all terms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal Undertaking */}
        <motion.div variants={fadeIn}>
          <FormSectionCard
            title="Legal Undertaking"
            description="Declaration of accuracy and truthfulness"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Please read carefully</span>
            </div>

            <ScrollArea className="h-48 rounded-md border p-4 mb-4">
              <div className="text-sm space-y-4">
                <p>
                  I, the undersigned, hereby declare that:
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>
                    All information provided in this application is true, complete, and accurate 
                    to the best of my knowledge.
                  </li>
                  <li>
                    I understand that any false or misleading information may result in the 
                    rejection of my application or cancellation of my registration.
                  </li>
                  <li>
                    I accept full responsibility for the authenticity of all documents submitted 
                    in support of this application.
                  </li>
                  <li>
                    I understand that the University reserves the right to verify any information 
                    provided and may request additional documentation.
                  </li>
                  <li>
                    I agree to abide by all rules, regulations, and policies of the University 
                    of the Western Cape.
                  </li>
                  <li>
                    I understand that submission of this application does not guarantee admission 
                    to the University.
                  </li>
                  <li>
                    I acknowledge that I am liable for all fees and charges incurred during my 
                    period of study, and that failure to pay may result in the withholding of 
                    academic records.
                  </li>
                </ol>
              </div>
            </ScrollArea>

            <div className="flex items-start gap-3">
              <Checkbox
                id="legalUndertaking"
                checked={agreements.legalUndertaking}
                onCheckedChange={(checked: boolean) => handleAgreementChange('legalUndertaking', checked)}
              />
              <Label htmlFor="legalUndertaking" className="cursor-pointer text-sm">
                I have read and agree to the Legal Undertaking declaration above
              </Label>
            </div>
          </FormSectionCard>
        </motion.div>

        {/* Access to Information */}
        <motion.div variants={fadeIn}>
          <FormSectionCard
            title="Access to Information"
            description="Consent for information sharing"
          >
            <ScrollArea className="h-32 rounded-md border p-4 mb-4">
              <div className="text-sm space-y-4">
                <p>
                  In terms of the Promotion of Access to Information Act (PAIA), I consent to:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    The University accessing my academic records from previous institutions.
                  </li>
                  <li>
                    The sharing of my academic results with sponsors, bursary providers, and 
                    other relevant parties as necessary.
                  </li>
                  <li>
                    The University contacting me via email, SMS, or other electronic means 
                    regarding my application and registration.
                  </li>
                </ul>
              </div>
            </ScrollArea>

            <div className="flex items-start gap-3">
              <Checkbox
                id="accessToInformation"
                checked={agreements.accessToInformation}
                onCheckedChange={(checked: boolean) => handleAgreementChange('accessToInformation', checked)}
              />
              <Label htmlFor="accessToInformation" className="cursor-pointer text-sm">
                I consent to the access and sharing of information as described above
              </Label>
            </div>
          </FormSectionCard>
        </motion.div>

        {/* Data Protection */}
        <motion.div variants={fadeIn}>
          <FormSectionCard
            title="Data Protection (POPIA)"
            description="Protection of Personal Information Act compliance"
          >
            <ScrollArea className="h-32 rounded-md border p-4 mb-4">
              <div className="text-sm space-y-4">
                <p>
                  In terms of the Protection of Personal Information Act (POPIA):
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    I understand that my personal information will be processed for the purpose 
                    of my application and potential registration.
                  </li>
                  <li>
                    I consent to the University storing and processing my personal information 
                    in accordance with its data protection policies.
                  </li>
                  <li>
                    I understand that I have the right to access, correct, or request deletion 
                    of my personal information.
                  </li>
                </ul>
              </div>
            </ScrollArea>

            <div className="flex items-start gap-3">
              <Checkbox
                id="dataProtection"
                checked={agreements.dataProtection}
                onCheckedChange={(checked: boolean) => handleAgreementChange('dataProtection', checked)}
              />
              <Label htmlFor="dataProtection" className="cursor-pointer text-sm">
                I consent to the processing of my personal information as described above
              </Label>
            </div>
          </FormSectionCard>
        </motion.div>

        {/* Academic Honesty */}
        <motion.div variants={fadeIn}>
          <FormSectionCard
            title="Academic Honesty"
            description="Commitment to academic integrity"
          >
            <div className="rounded-md border p-4 mb-4">
              <p className="text-sm">
                I commit to upholding the highest standards of academic honesty and integrity 
                throughout my studies at the University of the Western Cape. I understand that 
                plagiarism, cheating, and any form of academic dishonesty are serious offenses 
                that may result in disciplinary action, including expulsion.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="academicHonesty"
                checked={agreements.academicHonesty}
                onCheckedChange={(checked: boolean) => handleAgreementChange('academicHonesty', checked)}
              />
              <Label htmlFor="academicHonesty" className="cursor-pointer text-sm">
                I commit to maintaining academic honesty and integrity
              </Label>
            </div>
          </FormSectionCard>
        </motion.div>

        {/* Agreement Status */}
        <motion.div variants={fadeIn}>
          <Card className={allAgreed ? 'bg-success-50 border-success-200' : 'bg-neutral-50'}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {allAgreed ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-success-600" />
                    <div>
                      <p className="font-medium text-success-900">All Agreements Accepted</p>
                      <p className="text-sm text-success-700">
                        You can now submit your application.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-warning-600" />
                    <div>
                      <p className="font-medium text-warning-900">Pending Agreements</p>
                      <p className="text-sm text-warning-700">
                        Please accept all agreements to continue.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/application/alumni-staff')}
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
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !allAgreed}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
