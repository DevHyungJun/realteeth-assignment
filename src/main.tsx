import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/config/query-client'
import { ToastProvider } from './shared/context/ToastContext'
import Toast from './shared/ui/Toast/Toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toast />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
