// src/firebase/auth.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config,';

// Función para registrar usuario
export const registerUser = async (email, password, name) => {
    try {
        console.log('Registrando usuario:', email);

        // Crear usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Actualizar el perfil con el nombre
        await updateProfile(user, {
            displayName: name,
        });

        console.log('Usuario registrado exitosamente:', user);
        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
            },
        };
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return {
            success: false,
            error: error,
        };
    }
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
    try {
        console.log('Iniciando sesión:', email);

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        console.log('Sesión iniciada exitosamente:', user);
        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
            },
        };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return {
            success: false,
            error: error,
        };
    }
};

// Función para cerrar sesión
export const logoutUser = async () => {
    try {
        console.log('Cerrando sesión...');
        await signOut(auth);
        console.log('Sesión cerrada exitosamente');
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return {
            success: false,
            error: error,
        };
    }
};

// Función para enviar email de recuperación de contraseña
export const resetPassword = async email => {
    try {
        console.log('Enviando email de recuperación a:', email);
        await sendPasswordResetEmail(auth, email);
        console.log('Email de recuperación enviado');
        return {
            success: true,
        };
    } catch (error) {
        console.error('Error al enviar email de recuperación:', error);
        return {
            success: false,
            error: error,
        };
    }
};

// Función para escuchar cambios de autenticación
export const onAuthChange = callback => {
    return onAuthStateChanged(auth, callback);
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Función para verificar si hay un usuario autenticado
export const isUserAuthenticated = () => {
    return auth.currentUser !== null;
};

// Función para obtener mensajes de error amigables
export const getErrorMessage = errorCode => {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No existe una cuenta con este email';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta';
        case 'auth/email-already-in-use':
            return 'Ya existe una cuenta con este email';
        case 'auth/weak-password':
            return 'La contraseña debe tener al menos 6 caracteres';
        case 'auth/invalid-email':
            return 'Email inválido';
        case 'auth/user-disabled':
            return 'Esta cuenta ha sido deshabilitada';
        case 'auth/too-many-requests':
            return 'Demasiados intentos. Intenta más tarde';
        case 'auth/network-request-failed':
            return 'Error de conexión. Verifica tu internet';
        case 'auth/invalid-credential':
            return 'Credenciales inválidas. Verifica tu email y contraseña';
        default:
            return 'Ocurrió un error inesperado';
    }
};
