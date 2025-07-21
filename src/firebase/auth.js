// src/firebase/auth.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config.js';

// ✅ Función para registrar usuario CON datos adicionales
export const registerUser = async (
    email,
    password,
    displayName,
    additionalData = {}
) => {
    try {
        console.log('🔥 Registrando usuario:', email);

        // 1. Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // 2. Actualizar el perfil con el nombre
        if (displayName) {
            await updateProfile(user, {
                displayName: displayName,
            });
        }

        // 3. ✅ NUEVO: Guardar datos adicionales en Firestore
        const userDocData = {
            uid: user.uid,
            email: user.email,
            displayName: displayName || '',

            // Datos adicionales del formulario extendido
            ...additionalData,

            // Metadatos automáticos
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: user.emailVerified,
            lastLogin: new Date().toISOString(),
        };

        // Crear documento en la colección 'users'
        await setDoc(doc(db, 'users', user.uid), userDocData);

        console.log('✅ Usuario registrado y guardado en Firestore:', user.uid);

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                ...additionalData, // Incluir datos adicionales en la respuesta
            },
        };
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        return {
            success: false,
            error: getErrorMessage(error.code),
        };
    }
};

// ✅ Función mejorada para iniciar sesión
export const loginUser = async (email, password) => {
    try {
        console.log('🔥 Iniciando sesión:', email);

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // ✅ NUEVO: Actualizar último login en Firestore
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(
                userDocRef,
                {
                    lastLogin: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                { merge: true }
            ); // merge: true para no sobrescribir otros datos

            console.log('✅ Último login actualizado en Firestore');
        } catch (firestoreError) {
            console.warn(
                '⚠️ No se pudo actualizar último login:',
                firestoreError
            );
            // No fallar el login por esto
        }

        console.log('✅ Sesión iniciada exitosamente:', user.uid);
        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
            },
        };
    } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        return {
            success: false,
            error: getErrorMessage(error.code),
        };
    }
};

// ✅ NUEVA: Función para obtener datos completos del usuario desde Firestore
export const getUserData = async uid => {
    try {
        console.log('🔥 Obteniendo datos de usuario:', uid);

        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log('✅ Datos de usuario obtenidos:', userData);
            return {
                success: true,
                userData: userData,
            };
        } else {
            console.warn('⚠️ No se encontró documento de usuario en Firestore');
            return {
                success: false,
                error: 'Datos de usuario no encontrados',
            };
        }
    } catch (error) {
        console.error('❌ Error al obtener datos de usuario:', error);
        return {
            success: false,
            error: 'Error al obtener datos del usuario',
        };
    }
};

// ✅ NUEVA: Función para actualizar datos del usuario
export const updateUserData = async (uid, updateData) => {
    try {
        console.log('🔥 Actualizando datos de usuario:', uid);

        const userDocRef = doc(db, 'users', uid);
        await setDoc(
            userDocRef,
            {
                ...updateData,
                updatedAt: new Date().toISOString(),
            },
            { merge: true }
        );

        console.log('✅ Datos de usuario actualizados');
        return {
            success: true,
        };
    } catch (error) {
        console.error('❌ Error al actualizar datos de usuario:', error);
        return {
            success: false,
            error: 'Error al actualizar datos del usuario',
        };
    }
};

// Función para cerrar sesión (sin cambios)
export const logoutUser = async () => {
    try {
        console.log('🔥 Cerrando sesión...');
        await signOut(auth);
        console.log('✅ Sesión cerrada exitosamente');
        return {
            success: true,
        };
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        return {
            success: false,
            error: getErrorMessage(error.code),
        };
    }
};

// Función para enviar email de recuperación (sin cambios)
export const resetPassword = async email => {
    try {
        console.log('🔥 Enviando email de recuperación a:', email);
        await sendPasswordResetEmail(auth, email);
        console.log('✅ Email de recuperación enviado');
        return {
            success: true,
        };
    } catch (error) {
        console.error('❌ Error al enviar email de recuperación:', error);
        return {
            success: false,
            error: getErrorMessage(error.code),
        };
    }
};

// Función para escuchar cambios de autenticación (sin cambios)
export const onAuthChange = callback => {
    return onAuthStateChanged(auth, callback);
};

// Función para obtener el usuario actual (sin cambios)
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Función para verificar si hay un usuario autenticado (sin cambios)
export const isUserAuthenticated = () => {
    return auth.currentUser !== null;
};

// ✅ Función mejorada para obtener mensajes de error amigables
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
        case 'auth/requires-recent-login':
            return 'Necesitas iniciar sesión de nuevo para esta acción';
        case 'auth/operation-not-allowed':
            return 'Operación no permitida. Contacta al administrador';
        default:
            return 'Ocurrió un error inesperado';
    }
};
