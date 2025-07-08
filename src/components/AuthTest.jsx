// src/components/AuthTest.jsx
import React, { useState, useEffect } from 'react';
import {
    registerUser,
    loginUser,
    logoutUser,
    resetPassword,
    onAuthChange,
    getCurrentUser,
    getErrorMessage,
} from '../firebase/auth';

export const AuthTest = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Datos de prueba
    const [testData, setTestData] = useState({
        email: 'test@ejemplo.com',
        password: '123456',
        name: 'Usuario de Prueba',
    });

    // Escuchar cambios de autenticación
    useEffect(() => {
        const unsubscribe = onAuthChange(currentUser => {
            console.log('Estado de autenticación cambió:', currentUser);
            setUser(currentUser);
        });

        return unsubscribe; // Cleanup
    }, []);

    // Función para probar registro
    const testRegister = async () => {
        setLoading(true);
        setMessage('Registrando usuario...');

        const result = await registerUser(
            testData.email,
            testData.password,
            testData.name
        );

        if (result.success) {
            setMessage('✅ Usuario registrado exitosamente!');
        } else {
            const errorMsg = getErrorMessage(result.error.code);
            setMessage(`❌ Error al registrar: ${errorMsg}`);
        }

        setLoading(false);
    };

    // Función para probar login
    const testLogin = async () => {
        setLoading(true);
        setMessage('Iniciando sesión...');

        const result = await loginUser(testData.email, testData.password);

        if (result.success) {
            setMessage('✅ Sesión iniciada exitosamente!');
        } else {
            const errorMsg = getErrorMessage(result.error.code);
            setMessage(`❌ Error al iniciar sesión: ${errorMsg}`);
        }

        setLoading(false);
    };

    // Función para probar logout
    const testLogout = async () => {
        setLoading(true);
        setMessage('Cerrando sesión...');

        const result = await logoutUser();

        if (result.success) {
            setMessage('✅ Sesión cerrada exitosamente!');
        } else {
            setMessage('❌ Error al cerrar sesión');
        }

        setLoading(false);
    };

    // Función para probar recuperación de contraseña
    const testPasswordReset = async () => {
        setLoading(true);
        setMessage('Enviando email de recuperación...');

        const result = await resetPassword(testData.email);

        if (result.success) {
            setMessage('✅ Email de recuperación enviado!');
        } else {
            const errorMsg = getErrorMessage(result.error.code);
            setMessage(`❌ Error: ${errorMsg}`);
        }

        setLoading(false);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Prueba de Autenticación Firebase
                </h2>

                {/* Estado actual del usuario */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Estado actual:</h3>
                    {user ? (
                        <div className="text-green-600">
                            <p>✅ Usuario autenticado</p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong>Nombre:</strong>{' '}
                                {user.displayName || 'Sin nombre'}
                            </p>
                            <p>
                                <strong>UID:</strong> {user.uid}
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-600">
                            ❌ No hay usuario autenticado
                        </p>
                    )}
                </div>

                {/* Datos de prueba */}
                <div className="mb-6 p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Datos de prueba:</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={testData.name}
                            onChange={e =>
                                setTestData({
                                    ...testData,
                                    name: e.target.value,
                                })
                            }
                            className="p-2 border rounded"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={testData.email}
                            onChange={e =>
                                setTestData({
                                    ...testData,
                                    email: e.target.value,
                                })
                            }
                            className="p-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={testData.password}
                            onChange={e =>
                                setTestData({
                                    ...testData,
                                    password: e.target.value,
                                })
                            }
                            className="p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Botones de prueba */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={testRegister}
                        disabled={loading}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Registrar Usuario
                    </button>

                    <button
                        onClick={testLogin}
                        disabled={loading}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        Iniciar Sesión
                    </button>

                    <button
                        onClick={testLogout}
                        disabled={loading || !user}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        Cerrar Sesión
                    </button>

                    <button
                        onClick={testPasswordReset}
                        disabled={loading}
                        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
                    >
                        Recuperar Contraseña
                    </button>
                </div>

                {/* Mensaje de estado */}
                {message && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm">{message}</p>
                    </div>
                )}

                {/* Indicador de carga */}
                {loading && (
                    <div className="text-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
