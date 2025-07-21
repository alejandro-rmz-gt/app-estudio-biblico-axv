// src/components/AuthRedirect.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthRedirect = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Verificando autenticación...
                    </p>
                </div>
            </div>
        );
    }

    // Si YA está autenticado, redirigir al home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si NO está autenticado, mostrar el login
    return children;
};
