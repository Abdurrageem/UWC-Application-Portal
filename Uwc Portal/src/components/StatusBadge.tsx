import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: ApplicationStatus
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Submitted', variant: 'info' },
  pending: { label: 'Pending Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'error' },
  incomplete: { label: 'Incomplete', variant: 'warning' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}
