// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    registerUser,
    loginUser,
    logoutUser,
    resetPassword,
    onAuthChange,
    getCurrentUser,
    isUserAuthenticated,
    getErrorMessage,
} from '../firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Función para registrar usuario
    const signup = async (email, password, name) => {
        try {
            const result = await registerUser(email, password, name);
            if (result.success) {
                return { success: true, user: result.user };
            } else {
                return {
                    success: false,
                    error: getErrorMessage(result.error.code),
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Error inesperado al crear la cuenta',
            };
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            const result = await loginUser(email, password);
            if (result.success) {
                return { success: true, user: result.user };
            } else {
                return {
                    success: false,
                    error: getErrorMessage(result.error.code),
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Error inesperado al iniciar sesión',
            };
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            const result = await logoutUser();
            if (result.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Error al cerrar sesión',
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Error inesperado al cerrar sesión',
            };
        }
    };

    // Función para recuperar contraseña
    const forgotPassword = async email => {
        try {
            const result = await resetPassword(email);
            if (result.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: getErrorMessage(result.error.code),
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Error inesperado al enviar email de recuperación',
            };
        }
    };

    // Escuchar cambios de autenticación
    useEffect(() => {
        const unsubscribe = onAuthChange(user => {
            if (user) {
                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    emailVerified: user.emailVerified,
                });
                setIsAuthenticated(true);
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        signup,
        login,
        logout,
        forgotPassword,
        // Funciones de utilidad
        getCurrentUser: () => getCurrentUser(),
        isUserAuthenticated: () => isUserAuthenticated(),
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
