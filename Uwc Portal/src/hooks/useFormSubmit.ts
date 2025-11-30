import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useFormSubmit<T>({
  onSuccess,
  onError,
  successMessage = 'Changes saved successfully',
  errorMessage = 'An error occurred. Please try again.',
}: UseFormSubmitOptions<T> = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (submitFn: () => Promise<T>) => {
      setIsSubmitting(true)
      try {
        const result = await submitFn()
        toast.success(successMessage)
        onSuccess?.(result)
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error')
        toast.error(errorMessage)
        onError?.(err)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess, onError, successMessage, errorMessage]
  )

  return { isSubmitting, handleSubmit }
}
