import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
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


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage />},
      { path: "/sign-in/*", element: <SignInPage />},
      { path: "/sign-up/*", element: <SignUpPage />},
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage />}
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
