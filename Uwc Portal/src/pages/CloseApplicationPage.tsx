import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Home, FileText, HelpCircle, Copy, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageContainer } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'

export function CloseApplicationPage() {
  const navigate = useNavigate()
  const [applicationNumber, setApplicationNumber] = useState('')
  const [submittedDate, setSubmittedDate] = useState('')

  useEffect(() => {
    // Generate application number and timestamp
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 900000) + 100000
    setApplicationNumber(`UWC${year}${randomNum}`)
    setSubmittedDate(new Date().toLocaleString('en-ZA', {
      dateStyle: 'full',
      timeStyle: 'short',
    }))
  }, [])

  const handleCopyApplicationNumber = () => {
    navigator.clipboard.writeText(applicationNumber)
    toast.success('Application number copied to clipboard')
  }

  return (
    <PageContainer
      title="Application Submitted"
      description="Thank you for applying to the University of the Western Cape"
    >
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        {/* Success Banner */}
        <motion.div variants={fadeIn}>
          <Card className="bg-success-50 border-success-200">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="h-16 w-16 mx-auto text-success-600 mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-success-900 mb-2">
                Application Successfully Submitted!
              </h2>
              <p className="text-success-700">
                Your application has been received and is being processed.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Details */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Application Number</p>
                  <p className="text-xl font-bold font-mono">{applicationNumber}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyApplicationNumber}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Submitted On</p>
                  <p className="font-medium">{submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-warning-600">Under Review</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium">What happens next?</p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Your application will be reviewed by the admissions team</li>
                  <li>You will receive an email confirmation shortly</li>
                  <li>Track your application status online using your application number</li>
                  <li>Final admission decisions are typically communicated within 4-6 weeks</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Information */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Check Application Status</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use your application number to track the status of your application online.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/application/status')}>
                    Track Status
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contact our admissions office for any questions or concerns.
                  </p>
                  <div className="text-sm">
                    <p>Email: admissions@uwc.ac.za</p>
                    <p>Tel: +27 21 959 2911</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
                <h4 className="font-medium text-info-900 mb-2">Keep Your Application Number Safe</h4>
                <p className="text-sm text-info-700">
                  Your application number <strong>{applicationNumber}</strong> is required for all 
                  communications regarding your application. Please save it in a secure place.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.open('https://www.uwc.ac.za', '_blank')}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>UWC Website</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => navigate('/application/status')}
                >
                  <FileText className="h-5 w-5" />
                  <span>Application Status</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.open('mailto:admissions@uwc.ac.za', '_blank')}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Contact Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exit Button */}
        <motion.div variants={fadeIn} className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="min-w-[200px]"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
