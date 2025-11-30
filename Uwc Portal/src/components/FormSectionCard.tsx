import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle, Circle, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FormSection } from '@/lib/types'
import { staggerContainer, staggerItem } from '@/lib/animations'

// Simple card variant for form sections with children
export interface FormSectionCardProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function FormSectionCard({ title, description, children, className }: FormSectionCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      {children && (
        <CardContent>{children}</CardContent>
      )}
    </Card>
  )
}

// Navigable card variant for form section lists
interface NavigableFormSectionCardProps {
  section: FormSection
}

export function NavigableFormSectionCard({ section }: NavigableFormSectionCardProps) {
  const statusIcon = {
    complete: <CheckCircle className="h-5 w-5 text-success-500" />,
    incomplete: <AlertCircle className="h-5 w-5 text-warning-500" />,
    not_started: <Circle className="h-5 w-5 text-neutral-300" />,
  }

  return (
    <Link to={section.href}>
      <Card className="card-interactive group">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {statusIcon[section.status]}
            <div>
              <CardTitle className="text-base group-hover:text-primary-600 transition-colors">
                {section.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {section.description}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
        </CardHeader>
      </Card>
    </Link>
  )
}

interface FormSectionListProps {
  sections: FormSection[]
}

export function FormSectionList({ sections }: FormSectionListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {sections.map((section) => (
        <motion.div key={section.id} variants={staggerItem}>
          <NavigableFormSectionCard section={section} />
        </motion.div>
      ))}
    </motion.div>
  )
}
