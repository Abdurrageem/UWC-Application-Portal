import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

// Define the order of application steps
export const APPLICATION_STEPS = [
  { id: 'program-details', title: 'Program Details', path: '/application/program-details' },
  { id: 'personal-information', title: 'Personal Information', path: '/application/personal-information' },
  { id: 'demographic-information', title: 'Demographic Information', path: '/application/demographic-information' },
  { id: 'contact-details', title: 'Contact Details', path: '/application/contact-details' },
  { id: 'next-of-kin', title: 'Next of Kin', path: '/application/next-of-kin' },
  { id: 'matric-exam-details', title: 'Matric Exam Details', path: '/application/matric-exam-details' },
  { id: 'matric-subjects', title: 'Matric Subjects', path: '/application/matric-subjects' },
  { id: 'tertiary-education', title: 'Tertiary Education', path: '/application/tertiary-education' },
  { id: 'financial-information', title: 'Financial Information', path: '/application/financial-information' },
  { id: 'grants-scholarships', title: 'Grants & Scholarships', path: '/application/grants-scholarships' },
  { id: 'document-upload', title: 'Document Upload', path: '/application/document-upload' },
  { id: 'alumni-staff', title: 'Alumni & Staff', path: '/application/alumni-staff' },
  { id: 'agreement', title: 'Agreement', path: '/application/agreement' },
] as const

export type StepId = typeof APPLICATION_STEPS[number]['id']

export interface Draft {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  completedSteps: StepId[]
  currentStep: StepId
  data: Record<string, unknown>
}

interface ApplicationContextType {
  // Current draft management
  currentDraft: Draft | null
  drafts: Draft[]
  
  // Step completion
  completedSteps: StepId[]
  currentStep: StepId
  
  // Actions
  isStepUnlocked: (stepId: StepId) => boolean
  isStepCompleted: (stepId: StepId) => boolean
  completeStep: (stepId: StepId) => void
  getNextStep: (stepId: StepId) => StepId | null
  getPreviousStep: (stepId: StepId) => StepId | null
  getStepIndex: (stepId: StepId) => number
  getProgressPercentage: () => number
  
  // Draft actions
  createNewDraft: (name?: string) => Draft
  loadDraft: (draftId: string) => void
  saveDraft: (stepId: StepId, data: Record<string, unknown>) => void
  deleteDraft: (draftId: string) => void
  renameDraft: (draftId: string, newName: string) => void
  
  // Step data
  getStepData: (stepId: StepId) => unknown
  setStepData: (stepId: StepId, data: unknown) => void
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

const DRAFTS_STORAGE_KEY = 'uwc_application_drafts'
const CURRENT_DRAFT_KEY = 'uwc_current_draft_id'

function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateDraftName(): string {
  const date = new Date()
  return `Application Draft - ${date.toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null)

  // Load drafts from localStorage on mount
  useEffect(() => {
    const storedDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY)
    if (storedDrafts) {
      try {
        const parsedDrafts = JSON.parse(storedDrafts) as Draft[]
        setDrafts(parsedDrafts)
        
        // Load current draft if exists
        const currentDraftId = localStorage.getItem(CURRENT_DRAFT_KEY)
        if (currentDraftId) {
          const draft = parsedDrafts.find(d => d.id === currentDraftId)
          if (draft) {
            setCurrentDraft(draft)
          }
        }
      } catch (e) {
        console.error('Error loading drafts:', e)
      }
    }
  }, [])

  // Save drafts to localStorage whenever they change
  useEffect(() => {
    if (drafts.length > 0) {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts))
    }
  }, [drafts])

  // Save current draft ID
  useEffect(() => {
    if (currentDraft) {
      localStorage.setItem(CURRENT_DRAFT_KEY, currentDraft.id)
    } else {
      localStorage.removeItem(CURRENT_DRAFT_KEY)
    }
  }, [currentDraft])

  const completedSteps = currentDraft?.completedSteps || []
  const currentStep = currentDraft?.currentStep || 'program-details'

  const getStepIndex = useCallback((stepId: StepId): number => {
    return APPLICATION_STEPS.findIndex(step => step.id === stepId)
  }, [])

  const isStepUnlocked = useCallback((stepId: StepId): boolean => {
    const stepIndex = getStepIndex(stepId)
    if (stepIndex === 0) return true // First step is always unlocked
    
    // Check if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(APPLICATION_STEPS[i].id)) {
        return false
      }
    }
    return true
  }, [completedSteps, getStepIndex])

  const isStepCompleted = useCallback((stepId: StepId): boolean => {
    return completedSteps.includes(stepId)
  }, [completedSteps])

  const completeStep = useCallback((stepId: StepId) => {
    if (!currentDraft) return

    const updatedCompletedSteps = completedSteps.includes(stepId)
      ? completedSteps
      : [...completedSteps, stepId]

    const stepIndex = getStepIndex(stepId)
    const nextStep = stepIndex < APPLICATION_STEPS.length - 1
      ? APPLICATION_STEPS[stepIndex + 1].id
      : stepId

    const updatedDraft: Draft = {
      ...currentDraft,
      completedSteps: updatedCompletedSteps,
      currentStep: nextStep,
      updatedAt: new Date().toISOString(),
    }

    setCurrentDraft(updatedDraft)
    setDrafts(prev => prev.map(d => d.id === updatedDraft.id ? updatedDraft : d))
  }, [currentDraft, completedSteps, getStepIndex])

  const getNextStep = useCallback((stepId: StepId): StepId | null => {
    const stepIndex = getStepIndex(stepId)
    if (stepIndex < APPLICATION_STEPS.length - 1) {
      return APPLICATION_STEPS[stepIndex + 1].id
    }
    return null
  }, [getStepIndex])

  const getPreviousStep = useCallback((stepId: StepId): StepId | null => {
    const stepIndex = getStepIndex(stepId)
    if (stepIndex > 0) {
      return APPLICATION_STEPS[stepIndex - 1].id
    }
    return null
  }, [getStepIndex])

  const getProgressPercentage = useCallback((): number => {
    if (completedSteps.length === 0) return 0
    return Math.round((completedSteps.length / APPLICATION_STEPS.length) * 100)
  }, [completedSteps])

  const createNewDraft = useCallback((name?: string): Draft => {
    const newDraft: Draft = {
      id: generateDraftId(),
      name: name || generateDraftName(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedSteps: [],
      currentStep: 'program-details',
      data: {},
    }

    setDrafts(prev => [...prev, newDraft])
    setCurrentDraft(newDraft)
    return newDraft
  }, [])

  const loadDraft = useCallback((draftId: string) => {
    const draft = drafts.find(d => d.id === draftId)
    if (draft) {
      setCurrentDraft(draft)
    }
  }, [drafts])

  const saveDraft = useCallback((stepId: StepId, data: Record<string, unknown>) => {
    if (!currentDraft) return

    const updatedDraft: Draft = {
      ...currentDraft,
      updatedAt: new Date().toISOString(),
      data: {
        ...currentDraft.data,
        [stepId]: data,
      },
    }

    setCurrentDraft(updatedDraft)
    setDrafts(prev => prev.map(d => d.id === updatedDraft.id ? updatedDraft : d))
  }, [currentDraft])

  const deleteDraft = useCallback((draftId: string) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId))
    if (currentDraft?.id === draftId) {
      setCurrentDraft(null)
    }
  }, [currentDraft])

  const renameDraft = useCallback((draftId: string, newName: string) => {
    setDrafts(prev => prev.map(d => 
      d.id === draftId 
        ? { ...d, name: newName, updatedAt: new Date().toISOString() }
        : d
    ))
    if (currentDraft?.id === draftId) {
      setCurrentDraft(prev => prev ? { ...prev, name: newName } : null)
    }
  }, [currentDraft])

  const getStepData = useCallback((stepId: StepId): unknown => {
    return currentDraft?.data[stepId] || null
  }, [currentDraft])

  const setStepData = useCallback((stepId: StepId, data: unknown) => {
    if (!currentDraft) return

    const updatedDraft: Draft = {
      ...currentDraft,
      updatedAt: new Date().toISOString(),
      data: {
        ...currentDraft.data,
        [stepId]: data,
      },
    }

    setCurrentDraft(updatedDraft)
    setDrafts(prev => prev.map(d => d.id === updatedDraft.id ? updatedDraft : d))
  }, [currentDraft])

  const value: ApplicationContextType = {
    currentDraft,
    drafts,
    completedSteps,
    currentStep,
    isStepUnlocked,
    isStepCompleted,
    completeStep,
    getNextStep,
    getPreviousStep,
    getStepIndex,
    getProgressPercentage,
    createNewDraft,
    loadDraft,
    saveDraft,
    deleteDraft,
    renameDraft,
    getStepData,
    setStepData,
  }

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider')
  }
  return context
}
