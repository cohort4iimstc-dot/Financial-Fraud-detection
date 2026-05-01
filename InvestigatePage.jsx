import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import InvestigatePage from './pages/InvestigatePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'transactions', Component: Transactions },
      { path: 'alerts', Component: Alerts },
      { path: 'analytics', Component: Analytics },
      { path: 'investigate/:id', Component: InvestigatePage },
    ],
  },
]);
