import { motion } from 'framer-motion'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { tableRowAnimation, staggerContainer } from '@/lib/animations'

interface Column<T> {
  key: keyof T | string
  header: string
  width?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  emptyMessage?: string
  showActions?: boolean
  keyField?: keyof T
}

export function DataTable<T extends object>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
  showActions = true,
  keyField = 'id' as keyof T,
}: DataTableProps<T>) {
  const getValue = (row: T, key: string) => {
    const keys = key.split('.')
    let value: unknown = row
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full">
        <thead>
          <tr className="bg-neutral-50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="table-header-cell"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
            {showActions && (
              <th className="table-header-cell w-24">Actions</th>
            )}
          </tr>
        </thead>
        <motion.tbody
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {data.map((row, index) => (
            <motion.tr
              key={String(row[keyField]) || index}
              variants={tableRowAnimation}
              className="hover:bg-neutral-50 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="table-body-cell"
                >
                  {column.render
                    ? column.render(getValue(row, String(column.key)), row)
                    : String(getValue(row, String(column.key)) ?? '-')}
                </td>
              ))}
              {showActions && (
                <td className="table-body-cell">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-error-500 hover:text-error-600 hover:bg-error-50"
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  )
}

interface AddButtonProps {
  onClick: () => void
  label?: string
}

export function AddButton({ onClick, label = 'Add New' }: AddButtonProps) {
  return (
    <Button onClick={onClick} className="gap-2">
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  )
}
