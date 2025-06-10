import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Profile } from './components/Profile/Profile';

function App() {
  const { user, loading, error, login, register, logout, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm
        onSubmit={login}
        loading={loading}
        error={error}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    ) : (
      <RegisterForm
        onSubmit={register}
        loading={loading}
        error={error}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user!}
        onProfileClick={() => setShowProfile(true)}
        onLogout={logout}
      />
      
      <main>
        <Dashboard />
      </main>

      {showProfile && (
        <Profile
          user={user!}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}

export default App;