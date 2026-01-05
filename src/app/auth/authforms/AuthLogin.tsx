'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Login component with Google sign-in for Yayasan Al Muhajirin
 */
const AuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Show error from URL if present
  const urlError = searchParams.get('error') ? decodeURIComponent(searchParams.get('error') || '') : '';

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle(callbackUrl);
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {(error || urlError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error || urlError}</AlertDescription>
        </Alert>
      )}

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500 bg-white">Masuk dengan akun Google</span>
        </div>
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full py-6 border-2 border-[#00BCD4]/30 hover:bg-[#B2EBF2]/20 hover:border-[#00BCD4] transition-all duration-300 rounded-xl"
        type="button"
        disabled={loading}
      >
        <div className="flex items-center justify-center w-full">
          <FcGoogle className="h-6 w-6 mr-3" />
          <span className="text-base font-medium text-[#006064]">
            {loading ? 'Memproses...' : 'Masuk dengan Google'}
          </span>
        </div>
      </Button>

      <div className="pt-4 text-center">
        <p className="text-xs text-gray-500">
          Dengan masuk, Anda dapat mengakses sistem informasi Yayasan Al Muhajirin
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;
