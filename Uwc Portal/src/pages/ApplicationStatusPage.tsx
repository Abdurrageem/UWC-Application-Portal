import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, FileText, Download } from 'lucide-react'
import { PageContainer } from '@/components/PageContainer'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { applications } from '@/lib/data'

export function ApplicationStatusPage() {
  const application = applications.find(app => app.status === 'submitted') || applications[0]

  const timeline = [
    { id: 1, title: 'Application Started', date: '2024-11-01', status: 'completed' as const },
    { id: 2, title: 'Personal Information', date: '2024-11-05', status: 'completed' as const },
    { id: 3, title: 'Academic Details', date: '2024-11-10', status: 'completed' as const },
    { id: 4, title: 'Documents Uploaded', date: '2024-11-12', status: 'completed' as const },
    { id: 5, title: 'Application Submitted', date: '2024-11-15', status: 'completed' as const },
    { id: 6, title: 'Under Review', date: null, status: 'current' as const },
    { id: 7, title: 'Final Decision', date: null, status: 'pending' as const },
  ]

  return (
    <PageContainer
      title="Application Status"
      description="Track your application progress"
      actions={
        <Link to="/application">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Application
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>{application.applicationNumber}</CardTitle>
                    <CardDescription className="mt-1">
                      Academic Year {application.academicYear}
                    </CardDescription>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Completion Progress</span>
                    <span className="font-medium">{application.completionPercentage}%</span>
                  </div>
                  <Progress value={application.completionPercentage} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Submission Date</p>
                    <p className="font-medium">
                      {application.submissionDate 
                        ? new Date(application.submissionDate).toLocaleDateString()
                        : 'Not submitted'}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(application.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {timeline.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 last:pb-0"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'completed'
                              ? 'bg-success-100'
                              : item.status === 'current'
                              ? 'bg-primary-100'
                              : 'bg-neutral-100'
                          }`}
                        >
                          {item.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-success-600" />
                          ) : item.status === 'current' ? (
                            <Clock className="h-4 w-4 text-primary-600" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-neutral-300" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 mt-2 ${
                              item.status === 'completed'
                                ? 'bg-success-200'
                                : 'bg-neutral-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p
                          className={`font-medium ${
                            item.status === 'pending'
                              ? 'text-neutral-400'
                              : 'text-neutral-900'
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.date && (
                          <p className="text-sm text-neutral-500">
                            {new Date(item.date).toLocaleDateString('en-ZA', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Program Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.programSelection ? (
                  <>
                    <div>
                      <p className="text-sm text-neutral-500">First Choice</p>
                      <p className="font-medium">{application.programSelection.firstChoice}</p>
                    </div>
                    {application.programSelection.secondChoice && (
                      <div>
                        <p className="text-sm text-neutral-500">Second Choice</p>
                        <p className="font-medium">{application.programSelection.secondChoice}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-neutral-500">Campus</p>
                      <p className="font-medium">{application.programSelection.campusPreference}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-neutral-500">No program selected yet</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.documents && application.documents.length > 0 ? (
                  application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-neutral-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <Badge
                            variant={
                              doc.status === 'verified'
                                ? 'success'
                                : doc.status === 'rejected'
                                ? 'error'
                                : 'warning'
                            }
                            className="mt-1"
                          >
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500">No documents uploaded</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/application" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Edit Application
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  Download Application PDF
                </Button>
                <Link to="/help" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  )
}
