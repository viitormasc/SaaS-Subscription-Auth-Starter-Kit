import { toast } from 'react-toastify';

export default async function getGoogleAuth() {
  try {
    // Instead of an XHR request, perform a full page redirect
    // TODO : FIX THIS FOR PRODUCTION
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`; // Or just '/api/auth/google' if your frontend and backend are on the same domain/port for initial load
    // No need to return anything here as the page will redirect
  } catch (err: any) {
    // Handle any immediate errors, though a direct redirect usually doesn't throw here
    console.error('Error initiating Google OAuth:', err);
    toast.error('Failed to initiate Google login.');
    throw err;
  }
}
