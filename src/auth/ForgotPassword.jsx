// src/auth/ForgotPassword.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Mail,
    ArrowLeft,
    BookOpen,
    CheckCircle,
    AlertCircle,
    Send,
} from 'lucide-react';

export const ForgotPassword = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const { forgotPassword } = useAuth();

    // Validación de email
    const validateEmail = email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Manejar cambio en el input
    const handleEmailChange = e => {
        setEmail(e.target.value);
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    // Manejar envío del formulario
    const handleSubmit = async e => {
        e.preventDefault();

        // Validar email
        if (!email.trim()) {
            setError('El email es requerido');
            return;
        }

        if (!validateEmail(email)) {
            setError('Ingresa un email válido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                setEmailSent(true);
                setSuccessMessage(
                    'Te hemos enviado un email con las instrucciones para recuperar tu contraseña. Revisa tu bandeja de entrada y spam.'
                );
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Error al enviar email de recuperación:', error);
            setError('Error inesperado. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Reenviar email
    const handleResendEmail = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                setSuccessMessage('Email reenviado exitosamente.');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Error al reenviar el email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mb-4 shadow-lg">
                        <BookOpen className="w-10 h-10 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Recuperar Contraseña
                    </h1>
                    <p className="text-gray-600">
                        {emailSent
                            ? 'Revisa tu email'
                            : 'Te ayudamos a recuperar tu acceso'}
                    </p>
                </div>

                {/* Formulario principal */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {!emailSent ? (
                        /* Formulario para solicitar recuperación */
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    ¿Olvidaste tu contraseña?
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Ingresa tu email y te enviaremos un enlace
                                    para crear una nueva contraseña.
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                    <span className="text-red-700 text-sm">
                                        {error}
                                    </span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Campo Email */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Correo electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                                error
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Botón enviar */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center ${
                                        loading
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Enviar Enlace de Recuperación
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Pantalla de confirmación */
                        <div className="text-center">
                            {/* Mensaje de éxito */}
                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                                        ¡Email Enviado!
                                    </h3>
                                    <p className="text-green-700 text-sm">
                                        {successMessage}
                                    </p>
                                </div>
                            )}

                            {/* Error en confirmación */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                    <span className="text-red-700 text-sm">
                                        {error}
                                    </span>
                                </div>
                            )}

                            {/* Instrucciones adicionales */}
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-2">
                                        Próximos pasos:
                                    </h4>
                                    <ul className="text-blue-700 text-sm space-y-1 text-left">
                                        <li>1. Revisa tu bandeja de entrada</li>
                                        <li>
                                            2. Si no lo encuentras, revisa
                                            spam/correo no deseado
                                        </li>
                                        <li>
                                            3. Haz clic en el enlace del email
                                        </li>
                                        <li>4. Crea tu nueva contraseña</li>
                                    </ul>
                                </div>

                                {/* Botón reenviar */}
                                <button
                                    onClick={handleResendEmail}
                                    disabled={loading}
                                    className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Reenviar Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Botón volver */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={onBackToLogin}
                            className="w-full flex items-center justify-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
