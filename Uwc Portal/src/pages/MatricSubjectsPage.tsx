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
import { DataTable, AddButton } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { matricSubjectSchema, type MatricSubject } from '@/lib/validations'
import { matricSubjects, subjectLevels, applications, getSymbolFromMark } from '@/lib/data'
import type { MatricSubjectData } from '@/lib/types'

export function MatricSubjectsPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<MatricSubjectData | null>(null)
  const { completeStep, saveDraft } = useApplication()
  
  const draftApplication = applications.find(app => app.status === 'draft')
  const [subjects, setSubjects] = useState<MatricSubjectData[]>(
    draftApplication?.matricSubjects || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MatricSubject>({
    resolver: zodResolver(matricSubjectSchema),
  })

  const openAddDialog = () => {
    reset({
      subject: '',
      level: undefined,
      mark: undefined,
      symbol: '',
    })
    setEditingSubject(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (subject: MatricSubjectData) => {
    reset({
      subject: subject.subject,
      level: subject.level as 'Higher' | 'Standard' | 'SG' | 'HG',
      mark: subject.mark,
      symbol: subject.symbol,
    })
    setEditingSubject(subject)
    setIsDialogOpen(true)
  }

  const handleDelete = (subject: MatricSubjectData) => {
    setSubjects(subjects.filter(s => s.id !== subject.id))
    toast.success('Subject removed')
  }

  const onDialogSubmit = (data: MatricSubject) => {
    const symbol = data.mark ? getSymbolFromMark(data.mark) : data.symbol

    if (editingSubject) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...data, symbol }
          : s
      ))
      toast.success('Subject updated')
    } else {
      const newSubject: MatricSubjectData = {
        id: `sub-${Date.now()}`,
        ...data,
        symbol,
      }
      setSubjects([...subjects, newSubject])
      toast.success('Subject added')
    }
    setIsDialogOpen(false)
    reset()
  }

  const handleSaveAndContinue = async () => {
    if (subjects.length === 0) {
      toast.error('Please add at least one subject')
      return
    }
    
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Subjects:', subjects)
      saveDraft('matric-subjects', { subjects })
      completeStep('matric-subjects')
      toast.success('Matric subjects saved successfully')
      navigate('/application/tertiary-education')
    } catch (error) {
      toast.error('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully')
  }

  const columns = [
    { key: 'subject', header: 'Subject' },
    { key: 'level', header: 'Level' },
    { key: 'mark', header: 'Mark (%)', render: (value: unknown) => value ? `${value}%` : '-' },
    { key: 'symbol', header: 'Symbol' },
  ]

  return (
    <PageContainer
      title="Matric Subjects"
      description="Add your matric subjects and results"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Your Subjects</CardTitle>
                <CardDescription>
                  Add all your matric subjects with their levels and marks
                </CardDescription>
              </div>
              <AddButton onClick={openAddDialog} label="Add Subject" />
            </CardHeader>
            <CardContent>
              <DataTable
                data={subjects}
                columns={columns}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                emptyMessage="No subjects added yet. Click 'Add Subject' to begin."
                keyField="id"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : 'Add Subject'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onDialogSubmit)} className="space-y-4">
              <FormField
                label="Subject"
                required
                error={errors.subject?.message}
              >
                <Select
                  onValueChange={(value) => setValue('subject', value)}
                  defaultValue={editingSubject?.subject}
                >
                  <SelectTrigger error={!!errors.subject}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {matricSubjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.label}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Level"
                required
                error={errors.level?.message}
              >
                <Select
                  onValueChange={(value) => setValue('level', value as 'Higher' | 'Standard' | 'SG' | 'HG')}
                  defaultValue={editingSubject?.level}
                >
                  <SelectTrigger error={!!errors.level}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Mark (%)"
                tooltip="Enter your final mark as a percentage (0-100)"
              >
                <Input
                  type="number"
                  {...register('mark', { valueAsNumber: true })}
                  placeholder="e.g., 75"
                  min={0}
                  max={100}
                />
              </FormField>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSubject ? 'Update' : 'Add'} Subject
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between gap-4"
        >
          <Link to="/application/matric-exam-details">
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
            <Button
              onClick={handleSaveAndContinue}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  )
}
