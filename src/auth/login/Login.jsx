// src/auth/Login.js
import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    BookOpen,
    ArrowRight,
    AlertCircle,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = ({ onSwitchToRegister, onForgotPassword }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { login } = useAuth();

    // Validación de email
    const validateEmail = email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Manejar cambios en inputs
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async e => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                console.log('Login exitoso:', result.user);
                navigate('/'); // Redirigir al home
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            console.error('Error en login:', error);
            setErrors({
                general: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mb-4 shadow-lg">
                    <BookOpen className="w-10 h-10 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Iniciar Sesión
                </h1>
                <p className="text-gray-600">
                    Bienvenido de vuelta a Biblia App
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Error general */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">
                            {errors.general}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={formData.email}
                                onChange={e =>
                                    handleInputChange('email', e.target.value)
                                }
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                    errors.email
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder="tu@email.com"
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={e =>
                                    handleInputChange(
                                        'password',
                                        e.target.value
                                    )
                                }
                                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                    errors.password
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder="Tu contraseña"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Enlace de contraseña olvidada */}
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-orange-600 text-sm hover:text-orange-700 font-medium transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    {/* Botón de login */}
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
                                Iniciar Sesión
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            o continúa con
                        </span>
                    </div>
                </div>

                {/* Botones de login social */}
                <div className="space-y-3">
                    <button
                        type="button"
                        className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <img
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23EA4335' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
                            alt="Google"
                            className="w-5 h-5 mr-3"
                        />
                        Google
                    </button>

                    <button
                        type="button"
                        className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <div className="w-5 h-5 mr-3 bg-blue-600 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                f
                            </span>
                        </div>
                        Facebook
                    </button>
                </div>

                {/* Link para ir al registro */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
                        >
                            Regístrate gratis
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
