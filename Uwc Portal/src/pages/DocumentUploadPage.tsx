import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useApplication } from '@/context'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageContainer, ProgressBar, FormSectionCard } from '@/components'
import { pageTransition, fadeIn } from '@/lib/animations'
import { toast } from 'sonner'

interface UploadedFile {
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'complete' | 'error'
}

interface DocumentType {
  id: string
  name: string
  description: string
  required: boolean
  maxSize: number // in MB
  acceptedTypes: string[]
}

const documentTypes: DocumentType[] = [
  {
    id: 'sa-id',
    name: 'SA ID Document',
    description: 'South African Identity Document (both sides)',
    required: true,
    maxSize: 4,
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  {
    id: 'nsc-certificate',
    name: 'NSC Certificate',
    description: 'National Senior Certificate (Matric Certificate)',
    required: true,
    maxSize: 4,
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  {
    id: 'affidavit',
    name: 'Affidavit',
    description: 'Sworn affidavit (if required)',
    required: false,
    maxSize: 4,
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  {
    id: 'improved-results',
    name: 'Improved Results',
    description: 'Improved matric results (if applicable)',
    required: false,
    maxSize: 4,
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  {
    id: 'academic-docs',
    name: 'Academic Documents',
    description: 'Previous academic transcripts or certificates',
    required: false,
    maxSize: 4,
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  {
    id: 'usaf-hesa',
    name: 'USAF/HESA Documents',
    description: 'USAF or HESA verification documents',
    required: false,
    maxSize: 4,
    acceptedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
]

const steps = [
  { label: 'Program', path: '/application/program-details' },
  { label: 'Personal', path: '/application/personal-information' },
  { label: 'Contact', path: '/application/contact-details' },
  { label: 'Next of Kin', path: '/application/next-of-kin' },
  { label: 'Financial', path: '/application/financial-information' },
  { label: 'Documents', path: '/application/document-upload' },
]

export function DocumentUploadPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({})
  const [dragOver, setDragOver] = useState<string | null>(null)
  const { completeStep, saveDraft } = useApplication()

  const handleFileSelect = useCallback((documentId: string, file: File) => {
    const docType = documentTypes.find((d) => d.id === documentId)
    if (!docType) return

    // Validate file size
    if (file.size > docType.maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${docType.maxSize}MB limit`)
      return
    }

    // Validate file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!docType.acceptedTypes.includes(extension)) {
      toast.error(`Invalid file type. Accepted types: ${docType.acceptedTypes.join(', ')}`)
      return
    }

    // Simulate upload
    setUploadedFiles((prev) => ({
      ...prev,
      [documentId]: {
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
      },
    }))

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadedFiles((prev) => ({
        ...prev,
        [documentId]: prev[documentId]
          ? { ...prev[documentId]!, progress: Math.min(progress, 100) }
          : null,
      }))

      if (progress >= 100) {
        clearInterval(interval)
        setUploadedFiles((prev) => ({
          ...prev,
          [documentId]: prev[documentId]
            ? { ...prev[documentId]!, status: 'complete' }
            : null,
        }))
        toast.success(`${file.name} uploaded successfully`)
      }
    }, 200)
  }, [])

  const handleDrop = useCallback(
    (documentId: string, e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(null)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileSelect(documentId, file)
      }
    },
    [handleFileSelect]
  )

  const handleRemoveFile = (documentId: string) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev }
      delete updated[documentId]
      return updated
    })
    toast.info('File removed')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async () => {
    // Check required documents
    const missingRequired = documentTypes
      .filter((doc) => doc.required && !uploadedFiles[doc.id])
      .map((doc) => doc.name)

    if (missingRequired.length > 0) {
      toast.error(`Please upload required documents: ${missingRequired.join(', ')}`)
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      saveDraft('document-upload', { uploadedFiles })
      completeStep('document-upload')
      toast.success('Documents saved successfully!')
      navigate('/application/alumni-staff')
    } catch {
      toast.error('Failed to save documents. Please try again.')
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
      title="Document Upload"
      description="Upload your supporting documents (max 4MB per file)"
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

        {/* Info Card */}
        <motion.div variants={fadeIn}>
          <Card className="bg-info-50 border-info-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-info-600 mt-0.5" />
                <div>
                  <p className="font-medium text-info-900">Document Requirements</p>
                  <ul className="text-sm text-info-700 mt-1 space-y-1">
                    <li>• Maximum file size: 4MB per document</li>
                    <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>• Ensure all documents are clearly legible</li>
                    <li>• Documents marked with * are required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Document Upload Sections */}
        <motion.div variants={fadeIn}>
          <FormSectionCard
            title="Required & Supporting Documents"
            description="Upload all necessary documents for your application"
          >
            <div className="space-y-6">
              {documentTypes.map((docType) => (
                <div key={docType.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Label>
                      {docType.name}
                      {docType.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">{docType.description}</p>

                  {uploadedFiles[docType.id] ? (
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {uploadedFiles[docType.id]?.status === 'complete' ? (
                              <CheckCircle className="h-5 w-5 text-success-600" />
                            ) : (
                              <Upload className="h-5 w-5 text-muted-foreground animate-pulse" />
                            )}
                            <div>
                              <p className="font-medium text-sm">
                                {uploadedFiles[docType.id]?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(uploadedFiles[docType.id]?.size || 0)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(docType.id)}
                            disabled={uploadedFiles[docType.id]?.status === 'uploading'}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {uploadedFiles[docType.id]?.status === 'uploading' && (
                          <Progress
                            value={uploadedFiles[docType.id]?.progress || 0}
                            className="mt-2 h-1"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragOver === docType.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(docType.id)
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop(docType.id, e)}
                    >
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your file here, or
                      </p>
                      <label>
                        <input
                          type="file"
                          className="hidden"
                          accept={docType.acceptedTypes.join(',')}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileSelect(docType.id, file)
                          }}
                        />
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">Browse Files</span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Max {docType.maxSize}MB • {docType.acceptedTypes.join(', ').toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FormSectionCard>
        </motion.div>

        {/* Upload Summary */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Upload Summary</p>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(uploadedFiles).length} of {documentTypes.filter((d) => d.required).length} required documents uploaded
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {documentTypes.filter((d) => d.required).every((d) => uploadedFiles[d.id]) ? (
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-warning-600" />
                  )}
                </div>
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
              onClick={() => navigate('/application/grants-scholarships')}
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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
