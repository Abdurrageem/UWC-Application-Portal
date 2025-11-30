import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  ArrowRight,
  Trash2,
  Edit3,
  FolderOpen,
} from 'lucide-react'
import { PageContainer } from '@/components/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useApplication, APPLICATION_STEPS } from '@/context'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function HomePage() {
  const navigate = useNavigate()
  const { 
    drafts, 
    currentDraft, 
    createNewDraft, 
    loadDraft, 
    deleteDraft, 
    renameDraft,
    getProgressPercentage,
    completedSteps,
  } = useApplication()
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [newDraftName, setNewDraftName] = useState('')

  const handleStartNewApplication = () => {
    createNewDraft()
    toast.success('New application started!')
    navigate('/application/program-details')
  }

  const handleContinueApplication = () => {
    if (currentDraft) {
      const currentStepIndex = completedSteps.length
      const nextStep = APPLICATION_STEPS[currentStepIndex] || APPLICATION_STEPS[0]
      navigate(nextStep.path)
    }
  }

  const handleLoadDraft = (draftId: string) => {
    loadDraft(draftId)
    toast.success('Draft loaded!')
    const draft = drafts.find(d => d.id === draftId)
    if (draft) {
      const stepIndex = draft.completedSteps.length
      const nextStep = APPLICATION_STEPS[stepIndex] || APPLICATION_STEPS[0]
      navigate(nextStep.path)
    }
  }

  const handleDeleteDraft = () => {
    if (selectedDraftId) {
      deleteDraft(selectedDraftId)
      toast.success('Draft deleted')
      setDeleteDialogOpen(false)
      setSelectedDraftId(null)
    }
  }

  const handleRenameDraft = () => {
    if (selectedDraftId && newDraftName.trim()) {
      renameDraft(selectedDraftId, newDraftName.trim())
      toast.success('Draft renamed')
      setRenameDialogOpen(false)
      setSelectedDraftId(null)
      setNewDraftName('')
    }
  }

  const openDeleteDialog = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDraftId(draftId)
    setDeleteDialogOpen(true)
  }

  const openRenameDialog = (draftId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDraftId(draftId)
    setNewDraftName(currentName)
    setRenameDialogOpen(true)
  }

  const totalDrafts = drafts.length
  const inProgressDrafts = drafts.filter(d => d.completedSteps.length > 0 && d.completedSteps.length < APPLICATION_STEPS.length).length

  return (
    <PageContainer
      title="Welcome!"
      description="Manage your application and track your progress"
    >
      {/* Quick Stats */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <Card className="bg-primary-50 border-primary-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-900">{totalDrafts}</p>
                  <p className="text-sm text-primary-600">Total Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-warning-50 border-warning-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning-100 rounded-lg">
                  <Clock className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-900">{inProgressDrafts}</p>
                  <p className="text-sm text-warning-600">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-success-50 border-success-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-900">
                    {currentDraft ? getProgressPercentage() : 0}%
                  </p>
                  <p className="text-sm text-success-600">Current Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="bg-neutral-50 border-neutral-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-neutral-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{APPLICATION_STEPS.length}</p>
                  <p className="text-sm text-neutral-600">Total Steps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Current Application Progress */}
      {currentDraft && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Current Application</CardTitle>
                  <CardDescription className="mt-1">
                    {currentDraft.name}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last updated: {new Date(currentDraft.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Application Progress</span>
                  <span className="font-medium">{getProgressPercentage()}% ({completedSteps.length}/{APPLICATION_STEPS.length} steps)</span>
                </div>
                <Progress value={getProgressPercentage()} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 gap-2" onClick={handleContinueApplication}>
                  Continue Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Start New or Load Draft */}
      {!currentDraft && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-dashed border-2 border-primary-200 bg-primary-50/30">
            <CardContent className="pt-6 text-center">
              <div className="p-4 bg-primary-100 rounded-full w-fit mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Your Application</h3>
              <p className="text-muted-foreground mb-4">
                Begin a new application or continue from a saved draft
              </p>
              <Button onClick={handleStartNewApplication} className="gap-2">
                <Plus className="h-4 w-4" />
                Start New Application
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Saved Drafts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Saved Drafts
              </CardTitle>
              <CardDescription>Continue working on your saved applications</CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={handleStartNewApplication}>
              <Plus className="h-4 w-4" />
              New Draft
            </Button>
          </CardHeader>
          <CardContent>
            {drafts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved drafts yet</p>
                <p className="text-sm">Start a new application to begin</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => {
                  const draftProgress = Math.round((draft.completedSteps.length / APPLICATION_STEPS.length) * 100)
                  const isCurrentDraft = currentDraft?.id === draft.id
                  
                  return (
                    <div
                      key={draft.id}
                      onClick={() => handleLoadDraft(draft.id)}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all group ${
                        isCurrentDraft 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-neutral-200 hover:border-primary-200 hover:bg-primary-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isCurrentDraft ? 'bg-primary-200' : 'bg-neutral-100 group-hover:bg-primary-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            isCurrentDraft ? 'text-primary-700' : 'text-neutral-600 group-hover:text-primary-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-neutral-900 truncate">{draft.name}</p>
                            {isCurrentDraft && (
                              <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-500">
                            <span>{draftProgress}% complete</span>
                            <span>•</span>
                            <span>Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 transition-all"
                              style={{ width: `${draftProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => openRenameDialog(draft.id, draft.name, e)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => openDeleteDialog(draft.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link to="/help">
          <Card className="card-interactive h-full">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Need Help?</h3>
              <p className="text-sm text-neutral-500">Contact support or view FAQs</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="card-interactive h-full" onClick={handleStartNewApplication}>
          <CardContent className="pt-6 cursor-pointer">
            <h3 className="font-semibold text-neutral-900 mb-2">Start Fresh</h3>
            <p className="text-sm text-neutral-500">Begin a new application from scratch</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Draft</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDraft}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Draft</DialogTitle>
            <DialogDescription>
              Enter a new name for this draft.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="draftName">Draft Name</Label>
            <Input
              id="draftName"
              value={newDraftName}
              onChange={(e) => setNewDraftName(e.target.value)}
              placeholder="Enter draft name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameDraft}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
