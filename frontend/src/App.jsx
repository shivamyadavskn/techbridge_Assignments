import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));

const AppContent = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={`app ${theme}`}>
            <Header />
            <main>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                        }
                    />
                    </Routes>
                </Suspense>
            </main>
        </div>
    )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
            <AppContent/>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 