import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import AdminLayout from './_layouts/private/_components/admin-layout';
import ExamplesLayout from './_layouts/private/_components/examples-layout';
import MainLayout from './_layouts/private/_components/main-layout';
import SettingsLayout from './_layouts/private/_components/settings-layout';
import PrivateLayout from './_layouts/private/private-layout';
import PublicLayout from './_layouts/public/public-layout';
import DashboardPage from './_pages/private/admin/dashboard/dashboard-page';
import RbacPage from './_pages/private/admin/rbac/rbac-page';
import UsersPage from './_pages/private/admin/users/users-page';
import DatePickerPage from './_pages/private/examples/forms/date-picker-page';
import InputPage from './_pages/private/examples/forms/input-page';
import ReactDropzonePage from './_pages/private/examples/forms/react-dropzone-page';
import ReactSelectPage from './_pages/private/examples/forms/react-select-page';
import HomePage from './_pages/private/home-page';
import GeneralPage from './_pages/private/settings/general-page';
import PasswordPage from './_pages/private/settings/password-page';
import ProfilePage from './_pages/private/settings/profile/profile-page';
import LoginPage from './_pages/public/login/login-page';
import useAuthUserStore from './_stores/auth-user-store';

const App = () => {
  const { token, user } = useAuthUserStore();

  // Private routes
  const privateRoutes = [
    {
      element: <PrivateLayout />,
      children: [
        //Account Type = Main
        ...(user?.account_type === 'Main'
          ? [
              ...(user?.is_admin
                ? [
                    {
                      path: 'admin',
                      element: <AdminLayout />,
                      children: [
                        {
                          path: '',
                          element: <DashboardPage />,
                        },
                        {
                          path: 'users',
                          element: <UsersPage />,
                          children: [
                            {
                              path: ':userTab',
                              element: <UsersPage />,
                            },
                          ],
                        },
                        {
                          path: 'rbac',
                          element: <RbacPage />,
                          children: [
                            {
                              path: ':rbacTab',
                              element: <UsersPage />,
                            },
                          ],
                        },
                      ],
                    },
                  ]
                : []),
              {
                path: '',
                element: <MainLayout />,
                children: [
                  {
                    path: '',
                    element: <HomePage />,
                  },
                ],
              },
              {
                path: 'examples',
                element: <ExamplesLayout />,
                children: [
                  {
                    path: '',
                    element: <Navigate to="/examples/forms" />,
                  },
                  {
                    path: 'forms',
                    element: <InputPage />,
                  },
                  {
                    path: 'forms/date-picker',
                    element: <DatePickerPage />,
                  },
                  {
                    path: 'forms/react-select',
                    element: <ReactSelectPage />,
                  },
                  {
                    path: 'forms/react-dropzone',
                    element: <ReactDropzonePage />,
                  },
                ],
              },
            ]
          : []),

        //Account Type = Guest
        ...(user?.account_type === 'Guest'
          ? [
              {
                path: '',
                element: <MainLayout />,
                children: [
                  {
                    path: '',
                    element: <h1>guest</h1>,
                  },
                ],
              },
            ]
          : []),

        {
          path: 'settings',
          element: <SettingsLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="profile" replace />,
            },
            {
              path: 'profile',
              element: <ProfilePage />,
            },
            {
              path: 'password',
              element: <PasswordPage />,
            },
            {
              path: 'general',
              element: <GeneralPage />,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ];

  // Public routes
  const publicRoutes = [
    {
      element: <PublicLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" />,
    },
  ];

  const router = createBrowserRouter(!token ? publicRoutes : privateRoutes);

  return <RouterProvider router={router} />;
};

export default App;
