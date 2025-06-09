import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from '@/pages/LoginPage';
import RoundsListPage from '@/pages/RoundsListPage/RoundsListPage';
import { RoundDetailsPage } from '@/pages/RoundDetailsPage';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/rounds"
        element={
          <ProtectedRoute>
            <RoundsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rounds/:id"
        element={
          <ProtectedRoute>
            <RoundDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/rounds" replace />} />
    </Routes>
  );
};

export default AppRoutes; 