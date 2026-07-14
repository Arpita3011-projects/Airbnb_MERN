import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NewListingPage from './pages/NewListingPage';
import EditListingPage from './pages/EditListingPage';
import RequireAuth from './components/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Navigate to="/listings" replace />,
      },
      {
        path: 'listings',
        element: <ListingsPage />,
      },
      {
        path: 'listings/new',
        element: (
          <RequireAuth>
            <NewListingPage />
          </RequireAuth>
        ),
      },
      {
        path: 'listings/:id',
        element: <ListingDetailPage />,
      },
      {
        path: 'listings/:id/edit',
        element: (
          <RequireAuth>
            <EditListingPage />
          </RequireAuth>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: '*',
        element: <div>404 Page Not Found</div>,
      },
    ],
  },
]);
