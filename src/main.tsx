import React from 'react'
import ReactDOM from 'react-dom/client'

import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import the layouts
import RootLayout from './layouts/root-layout';
import DashboardLayout from './layouts/dashboard-layout';

// Import the components
import IndexPage from './components/Index';
import SignInPage from './components/Sign-In';
import SignUpPage from './components/Sign-Up';
import DashboardPage from './components/Dashboard';

import './styles/Dashboard.css';


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <DashboardPage />},
      { path: "/sign-in/*", element: <SignInPage />},
      { path: "/sign-up/*", element: <SignUpPage />},
    ]
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

/* 
    A protected path, but I don't need it currently. Maybe later.
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage />}
        ]
      }

*/