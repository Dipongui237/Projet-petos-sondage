import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SurveyProvider } from './contexts/SurveyContext';
import Login from './pages/Login';
import Survey from './pages/Survey';
import Admin from './pages/Admin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
export function App() {
  return <Router>
      <AuthProvider>
        <SurveyProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/survey" element={<ProtectedRoute>
                    <Survey />
                  </ProtectedRoute>} />
              <Route path="/admin/*" element={<AdminRoute>
                    <Admin />
                  </AdminRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </SurveyProvider>
      </AuthProvider>
    </Router>;
}