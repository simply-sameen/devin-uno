import React, { useState, useEffect } from 'react';
import { LandingView } from './components/LandingView';
import { HostDashboard } from './components/HostDashboard';
import { CustomerMobileChat } from './components/CustomerMobileChat';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'host' | 'customer'>('landing');

  // Check URL parameters and pathname on mount and on popstate
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path.includes('/customer') || search.includes('mode=customer') || path.includes('/chat')) {
        setCurrentView('customer');
      } else if (search.includes('mode=terminal') || search.includes('mode=host')) {
        setCurrentView('host');
      } else {
        setCurrentView('landing');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const navigateTo = (view: 'landing' | 'host' | 'customer') => {
    setCurrentView(view);
    if (view === 'customer') {
      window.history.pushState({}, '', '/customer');
    } else if (view === 'host') {
      window.history.pushState({}, '', '/?mode=terminal');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  if (currentView === 'customer') {
    return <CustomerMobileChat onBackToHost={() => navigateTo('host')} />;
  }

  if (currentView === 'host') {
    return (
      <HostDashboard
        onBackToLanding={() => navigateTo('landing')}
        onOpenCustomer={() => navigateTo('customer')}
      />
    );
  }

  return (
    <LandingView
      onLaunchTerminal={() => navigateTo('host')}
      onLaunchCustomer={() => navigateTo('customer')}
    />
  );
}

export default App;
