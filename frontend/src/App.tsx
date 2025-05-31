import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import AdminLayout from './_layouts/private/_components/admin-layout';
import ExamplesLayout from './_layouts/private/_components/examples-layout';
import MainLayout from './_layouts/private/_components/main-layout';
import SettingsLayout from './_layouts/private/_components/settings-layout';
import PrivateLayout from './_layouts/private/private-layout';
import PublicLayout from './_layouts/public/public-layout';
import DashboardPage from './_pages/private/admin/dashboard/dashboard-page';
import SystemPage from './_pages/private/admin/system/system-page';
import UsersPage from './_pages/private/admin/users/users-page';
import DataTablePage from './_pages/private/examples/crud/data-table-page';
import GlobalDropdownPage from './_pages/private/examples/forms/global-dropdown-page';
import InputPage from './_pages/private/examples/forms/input-page';
import ReactDropzonePage from './_pages/private/examples/forms/react-dropzone-page';
import ReactQuillPage from './_pages/private/examples/forms/react-quill-page';
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
                          children: [
                            {
                              path: '',
                              element: <UsersPage />,
                            },
                            {
                              path: ':userTab',
                              element: <UsersPage />,
                              children: [
                                {
                                  path: ':rbacTab',
                                  element: <UsersPage />,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          path: 'system',
                          element: <SystemPage />,
                          children: [
                            {
                              path: '',
                            },
                            {
                              path: ':systemTab',
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
              ...(import.meta.env.VITE_ENV === 'development'
                ? [
                    {
                      path: 'examples',
                      element: <ExamplesLayout />,
                      children: [
                        {
                          path: '',
                          element: <Navigate to="forms" replace />,
                        },
                        {
                          path: 'forms',
                          children: [
                            {
                              path: '',
                              element: <InputPage />,
                            },
                            {
                              path: 'react-select',
                              element: <ReactSelectPage />,
                            },
                            {
                              path: 'react-dropzone',
                              element: <ReactDropzonePage />,
                            },
                            {
                              path: 'react-quill',
                              element: <ReactQuillPage />,
                            },
                            {
                              path: 'global-dropdown',
                              element: <GlobalDropdownPage />,
                            },
                          ],
                        },
                        {
                          path: 'crud',
                          children: [
                            {
                              path: '',
                              element: <Navigate to="data-table" replace />,
                            },
                            {
                              path: 'data-table',
                              element: <DataTablePage />,
                            },
                          ],
                        },
                      ],
                    },
                  ]
                : []),
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
