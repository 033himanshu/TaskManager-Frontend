import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Home, Auth, Profile} from './pages/index.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
        path : '/auth',
        element : <Auth/>,
      },
      {
        path : '/profile',
        element : <Profile />,
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
