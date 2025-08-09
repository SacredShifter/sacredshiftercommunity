import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from './hooks/useAuth';
import { TourProvider } from './components/TourProvider';
import { FrequencyProvider } from './contexts/FrequencyContext';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <FrequencyProvider>
      <Router>
        <AuthProvider>
          <TourProvider>
            <AppRoutes />
            <Toaster />
          </TourProvider>
        </AuthProvider>
      </Router>
    </FrequencyProvider>
  );
}

export default App;