import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './router'
import { ApplicationProvider } from './context'

function App() {
  return (
    <ApplicationProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          className: 'font-sans',
        }}
      />
    </ApplicationProvider>
  )
}

export default App
