import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FileText,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Lock,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { slideInLeft } from '@/lib/animations'
import { useApplication, APPLICATION_STEPS, StepId } from '@/context'
import { toast } from 'sonner'

interface NavItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
  children?: { title: string; href: string; stepId?: StepId }[]
  onClick?: () => void
}

interface ApplicationNavItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
  children: { title: string; href: string; stepId: StepId }[]
  onClick?: () => void
}

function ApplicationNavItem({ icon: Icon, title, isActive, children, onClick }: ApplicationNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isStepUnlocked, isStepCompleted, currentDraft } = useApplication()
  
  const isChildActive = children?.some(child => location.pathname === child.href)
  
  const handleChildClick = (child: { href: string; stepId: StepId }, e: React.MouseEvent) => {
    if (!currentDraft) {
      e.preventDefault()
      toast.error('Please start a new application or select a draft first')
      navigate('/')
      onClick?.()
      return
    }
    
    if (!isStepUnlocked(child.stepId)) {
      e.preventDefault()
      toast.error('Please complete the previous steps first')
      return
    }
    onClick?.()
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'sidebar-nav-item w-full',
          (isActive || isChildActive) && 'bg-primary-600 text-white'
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-8 space-y-1">
              {children.map((child) => {
                const isUnlocked = currentDraft ? isStepUnlocked(child.stepId) : false
                const isCompleted = currentDraft ? isStepCompleted(child.stepId) : false
                const isCurrentPath = location.pathname === child.href
                
                return (
                  <Link
                    key={child.href}
                    to={isUnlocked ? child.href : '#'}
                    onClick={(e) => handleChildClick(child, e)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200',
                      isCurrentPath
                        ? 'bg-primary-500/20 text-white'
                        : isUnlocked
                          ? 'text-neutral-400 hover:text-white hover:bg-sidebar-hover'
                          : 'text-neutral-600 cursor-not-allowed'
                    )}
                  >
                    {!isUnlocked && <Lock className="h-3 w-3" />}
                    {isCompleted && <CheckCircle className="h-3 w-3 text-success-500" />}
                    <span className={cn(!isUnlocked && 'opacity-50')}>{child.title}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavItem({ icon: Icon, title, href, isActive, onClick }: NavItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'sidebar-nav-item',
        isActive && 'bg-primary-600 text-white'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  )
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { getProgressPercentage, currentDraft } = useApplication()

  const applicationChildren = APPLICATION_STEPS.map(step => ({
    title: step.title,
    href: step.path,
    stepId: step.id,
  }))

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo Section */}
      <div className="p-4">
        <Link to="/" className="flex items-start gap-3" onClick={onClose}>
          <img 
            src="/uwc-logo.jpg" 
            alt="University of the Western Cape Logo" 
            className="w-32 h-32 object-contain flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight">UNIVERSITY of the WESTERN CAPE</h1>
            <p className="text-[10px] text-neutral-400 leading-tight">IYUNIVESITHI yaseNTSHONA KOLONI</p>
            <p className="text-[10px] text-neutral-400 leading-tight">UNIVERSITEIT van WES-KAAPLAND</p>
            <p className="text-xs text-primary-400 font-medium mt-1">Application Portal 2025</p>
          </div>
        </Link>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Progress Indicator */}
      {currentDraft && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="h-1.5 bg-sidebar-hover rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          <NavItem
            icon={Home}
            title="Home"
            href="/"
            isActive={location.pathname === '/'}
            onClick={onClose}
          />
          <ApplicationNavItem
            icon={FileText}
            title="Application"
            href="/application"
            isActive={location.pathname === '/application'}
            children={applicationChildren}
            onClick={onClose}
          />
          <NavItem
            icon={HelpCircle}
            title="Help & Support"
            href="/help"
            isActive={location.pathname === '/help'}
            onClick={onClose}
          />
        </nav>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-hover">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary-500 text-white text-sm">MJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Mathew James</p>
            <p className="text-xs text-neutral-400 truncate">3845721</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-sidebar-active"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[280px] lg:flex-col z-50">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              {...slideInLeft}
              className="fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden"
            >
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}
