import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { ChangeRecoverPasswordPage } from '@/pages/ChangeRecoverPasswordPage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { EmailValidationPage } from '@/pages/EmailValidationPage';
import Homepage from '@/pages/Homepage';
import PricingPage from '@/pages/PricingPage';
import { RecoveryEmailPasswordPage } from '@/pages/RecoveryEmailPasswordPage';
import SuccessPaymentPage from '@/pages/SuccessPaymentPage';
import MainLayout from '../layouts/MainLayout';
import Page404 from '../pages/Page404';
import ProtectedRoute from './ProtectedRoute';
const ReactRoutes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route path="/EmailValidationPage" element={<EmailValidationPage />} />
        <Route
          path="/ChangeRecoverPasswordPage/:userId"
          element={<ChangeRecoverPasswordPage />}
        />

        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPaymentPage />} />

        <Route
          path="/RecoveryEmailValidationPage"
          element={<RecoveryEmailPasswordPage />}
        />
        <Route path="*" element={<Page404 />} />

        <Route element={<ProtectedRoute isClosed={true} />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/editProfilePage" element={<EditProfilePage />} />
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default ReactRoutes;
