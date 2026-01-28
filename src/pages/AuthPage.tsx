import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/extensions/auth-email/LoginForm';
import RegisterForm from '@/components/extensions/auth-email/RegisterForm';
import ResetPasswordForm from '@/components/extensions/auth-email/ResetPasswordForm';
import UserProfile from '@/components/extensions/auth-email/UserProfile';
import { useAuth } from '@/components/extensions/auth-email/useAuth';

const AUTH_URL = 'https://functions.poehali.dev/8f24641f-6bd9-4176-b9ee-a4b6765409d2';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>('login');
  const [successMessage, setSuccessMessage] = useState('');

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

  if (auth.isAuthenticated && auth.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <UserProfile user={auth.user} onLogout={auth.logout} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Административная панель
          </h1>
          <p className="text-muted-foreground">
            Войдите для управления системой
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Авторизация</CardTitle>
            <CardDescription>Выберите способ входа</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
                <TabsTrigger value="reset">Сброс пароля</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm
                  onLogin={auth.login}
                  successMessage={successMessage}
                  isLoading={auth.isLoading}
                />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm
                  onRegister={auth.register}
                  onVerifyEmail={auth.verifyEmail}
                  isLoading={auth.isLoading}
                  onSuccess={(message) => {
                    setSuccessMessage(message);
                    setActiveTab('login');
                  }}
                />
              </TabsContent>

              <TabsContent value="reset">
                <ResetPasswordForm
                  onResetPassword={auth.resetPassword}
                  isLoading={auth.isLoading}
                  onSuccess={(message) => {
                    setSuccessMessage(message);
                    setActiveTab('login');
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}