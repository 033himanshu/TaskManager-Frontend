import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Home, Auth, Profile, ForgotPassword, ResetPassword, Project} from './pages/index.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from "@/components/ErrorBoundary"
const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        path : '/',
        element : <Home />,
      },
      {
        path : '/auth/forgot-password',
        element : <ForgotPassword/>,
      },
      {
        path : '/auth/reset-password/:paramToken',
        element : <ResetPassword/>,
      },
      {
        path : '/auth',
        element : <Auth/>,
      },
      {
        path : '/profile',
        element : <Profile />,
      },
      {
        path : '/project/:projectId',
        element : <Project />,
      },
      {
        path : '*',
        element : <Home/>
      },
    ]
  }
])
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/react-query-client';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)
