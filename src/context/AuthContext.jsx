// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config.js';
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserData,
    updateUserData,
} from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null); // ✅ NUEVO: Datos completos del perfil
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ✅ Función para cargar datos completos del usuario
    const loadUserProfile = async user => {
        if (user?.uid) {
            try {
                const result = await getUserData(user.uid);
                if (result.success) {
                    setUserProfile(result.userData);
                    console.log(
                        '✅ Perfil de usuario cargado:',
                        result.userData
                    );
                } else {
                    console.warn('⚠️ No se pudieron cargar datos del perfil');
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('❌ Error cargando perfil:', error);
                setUserProfile(null);
            }
        } else {
            setUserProfile(null);
        }
    };

    // ✅ Escuchar cambios de autenticación y cargar perfil
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            console.log(
                '🔥 Estado de autenticación cambió:',
                user?.uid || 'No autenticado'
            );

            setCurrentUser(user);
            setIsAuthenticated(!!user);

            // Cargar perfil completo si hay usuario
            if (user) {
                await loadUserProfile(user);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // ✅ Función de registro actualizada
    const signup = async (
        email,
        password,
        displayName,
        additionalData = {}
    ) => {
        setLoading(true);
        try {
            console.log(
                '🔥 Iniciando registro con datos adicionales:',
                additionalData
            );

            const result = await registerUser(
                email,
                password,
                displayName,
                additionalData
            );

            if (result.success) {
                // El usuario se actualizará automáticamente por onAuthStateChanged
                console.log('✅ Registro exitoso');
            }

            return result;
        } catch (error) {
            console.error('❌ Error en signup:', error);
            return {
                success: false,
                error: 'Error inesperado durante el registro',
            };
        } finally {
            setLoading(false);
        }
    };

    // ✅ Función de login (sin cambios en la interfaz)
    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await loginUser(email, password);

            if (result.success) {
                // El perfil se cargará automáticamente por onAuthStateChanged
                console.log('✅ Login exitoso');
            }

            return result;
        } catch (error) {
            console.error('❌ Error en login:', error);
            return {
                success: false,
                error: 'Error inesperado durante el inicio de sesión',
            };
        } finally {
            setLoading(false);
        }
    };

    // ✅ Función de logout actualizada
    const logout = async () => {
        setLoading(true);
        try {
            const result = await logoutUser();

            if (result.success) {
                // Limpiar estado local
                setCurrentUser(null);
                setUserProfile(null);
                setIsAuthenticated(false);
                console.log('✅ Logout exitoso');
            }

            return result;
        } catch (error) {
            console.error('❌ Error en logout:', error);
            return {
                success: false,
                error: 'Error al cerrar sesión',
            };
        } finally {
            setLoading(false);
        }
    };

    // ✅ NUEVA: Función para actualizar perfil del usuario
    const updateProfile = async updateData => {
        if (!currentUser?.uid) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            console.log('🔥 Actualizando perfil:', updateData);

            const result = await updateUserData(currentUser.uid, updateData);

            if (result.success) {
                // Recargar perfil después de actualizar
                await loadUserProfile(currentUser);
                console.log('✅ Perfil actualizado');
            }

            return result;
        } catch (error) {
            console.error('❌ Error actualizando perfil:', error);
            return {
                success: false,
                error: 'Error al actualizar perfil',
            };
        }
    };

    // ✅ NUEVA: Función para recargar perfil manualmente
    const reloadProfile = async () => {
        if (currentUser) {
            await loadUserProfile(currentUser);
        }
    };

    const value = {
        // Estados
        currentUser,
        userProfile, // ✅ NUEVO: Datos completos del perfil
        isAuthenticated,
        loading,

        // Funciones de autenticación
        signup, // ✅ Actualizada para manejar datos adicionales
        login,
        logout,

        // ✅ NUEVAS: Funciones para manejar perfil
        updateProfile,
        reloadProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
