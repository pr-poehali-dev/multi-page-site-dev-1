import { createContext, useContext, ReactNode } from 'react';
import { useAuth, User } from '@/components/extensions/auth-email/useAuth';

const AUTH_URL = 'https://functions.poehali.dev/8f24641f-6bd9-4176-b9ee-a4b6765409d2';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  login: (payload: { email: string; password: string }) => Promise<boolean>;
  register: (payload: { email: string; password: string; name?: string }) => Promise<{ success: boolean; emailVerificationRequired: boolean; message?: string }>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<{ code?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<boolean>;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth({
    apiUrls: {
      login: `${AUTH_URL}?action=login`,
      register: `${AUTH_URL}?action=register`,
      verifyEmail: `${AUTH_URL}?action=verify-email`,
      refresh: `${AUTH_URL}?action=refresh`,
      logout: `${AUTH_URL}?action=logout`,
      resetPassword: `${AUTH_URL}?action=reset-password`,
    },
  });

  const isEditor = !!auth.user && ['admin', 'moderator'].includes(auth.user.role || '');

  return (
    <AuthContext.Provider value={{ ...auth, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
