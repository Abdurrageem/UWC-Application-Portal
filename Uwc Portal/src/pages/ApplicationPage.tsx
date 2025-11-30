import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react'
import { PageContainer } from '@/components/PageContainer'
import { ProgressBar } from '@/components/ProgressBar'
import { FormSectionList } from '@/components/FormSectionCard'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { applicationFormSections, applications } from '@/lib/data'

export function ApplicationPage() {
  const draftApplication = applications.find(app => app.status === 'draft')
  
  // Calculate progress
  const completedCount = applicationFormSections.filter(s => s.status === 'complete').length
  const totalCount = applicationFormSections.length
  
  const progressSteps = applicationFormSections.map((section, index) => ({
    id: section.id,
    title: section.title,
    status: section.status === 'complete' ? 'completed' as const : 
           index === completedCount ? 'current' as const : 'upcoming' as const,
  }))

  return (
    <PageContainer
      title="Application Details"
      description="Complete all sections below to submit your application"
      actions={
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button className="gap-2" disabled={completedCount < totalCount}>
            <Send className="h-4 w-4" />
            Submit Application
          </Button>
        </div>
      }
    >
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <ProgressBar steps={progressSteps} currentStep={completedCount} />
      </motion.div>

      {/* Application Info */}
      {draftApplication && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Application Number</p>
                  <p className="font-medium text-neutral-900">{draftApplication.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Academic Year</p>
                  <p className="font-medium text-neutral-900">{draftApplication.academicYear}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Last Modified</p>
                  <p className="font-medium text-neutral-900">
                    {new Date(draftApplication.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Form Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Sections</CardTitle>
            <CardDescription>
              Complete each section in order. You can save your progress at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSectionList sections={applicationFormSections} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between"
      >
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/application/personal-information">
          <Button className="gap-2">
            Start Application
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </PageContainer>
  )
}
