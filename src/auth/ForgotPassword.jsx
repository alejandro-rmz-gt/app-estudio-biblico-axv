import React, { useState, useEffect } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Heart,
    BookOpen,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Shield,
    Clock,
} from 'lucide-react';

export const ForgotPassword = ({ onBackToLogin }) => {
    const [currentStep, setCurrentStep] = useState('email'); // 'email' or 'code'
    const [formData, setFormData] = useState({
        email: '',
        resetCode: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [countdown, setCountdown] = useState(0);

    // Countdown para reenvío de código
    useEffect(() => {
        let interval = null;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    // Validación de email
    const validateEmail = email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validación de contraseña
    const validatePassword = password => {
        return password.length >= 6;
    };

    // Validación de código de verificación
    const validateResetCode = code => {
        return code.length === 6 && /^\d+$/.test(code);
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

        // Limpiar mensaje de éxito
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    // Validar formulario según el paso actual
    const validateForm = () => {
        const newErrors = {};

        if (currentStep === 'email') {
            if (!formData.email.trim()) {
                newErrors.email = 'El email es requerido';
            } else if (!validateEmail(formData.email)) {
                newErrors.email = 'Ingresa un email válido';
            }
        } else if (currentStep === 'code') {
            if (!formData.resetCode) {
                newErrors.resetCode = 'El código es requerido';
            } else if (!validateResetCode(formData.resetCode)) {
                newErrors.resetCode = 'Ingresa un código válido de 6 dígitos';
            }

            if (!formData.newPassword) {
                newErrors.newPassword = 'La nueva contraseña es requerida';
            } else if (!validatePassword(formData.newPassword)) {
                newErrors.newPassword =
                    'La contraseña debe tener al menos 6 caracteres';
            }

            if (formData.newPassword !== formData.confirmNewPassword) {
                newErrors.confirmNewPassword = 'Las contraseñas no coinciden';
            }
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
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (currentStep === 'email') {
                console.log('Sending reset email to:', formData.email);
                // Aquí iría tu lógica para enviar email de recuperación
                setCurrentStep('code');
                setSuccessMessage(
                    `Hemos enviado un código de verificación a ${formData.email}`
                );
                setCountdown(60); // 60 segundos para reenvío
            } else if (currentStep === 'code') {
                console.log(
                    'Resetting password with code:',
                    formData.resetCode
                );
                // Aquí iría tu lógica para verificar código y cambiar contraseña
                setSuccessMessage('¡Contraseña cambiada exitosamente!');

                // Regresar al login después de 2 segundos
                setTimeout(() => {
                    onBackToLogin();
                }, 2000);
            }
        } catch (error) {
            setErrors({ general: 'Ocurrió un error. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    // Enviar código de recuperación nuevamente
    const handleResendCode = async () => {
        if (!formData.email || !validateEmail(formData.email)) {
            setErrors({ email: 'Email inválido' });
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCountdown(60);
            setSuccessMessage('Código reenviado exitosamente');
            console.log('Resending code to:', formData.email);
        } catch (error) {
            setErrors({ general: 'Error al reenviar el código' });
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el título según el paso
    const getTitle = () => {
        switch (currentStep) {
            case 'email':
                return 'Recuperar contraseña';
            case 'code':
                return 'Verificar código';
            default:
                return 'Recuperar contraseña';
        }
    };

    // Función para obtener el texto del botón
    const getButtonText = () => {
        switch (currentStep) {
            case 'email':
                return 'Enviar código';
            case 'code':
                return 'Cambiar contraseña';
            default:
                return 'Continuar';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
            {/* Contenedor principal */}
            <div className="w-full max-w-md">
                {/* Header decorativo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mb-4 shadow-lg">
                        <Shield className="w-10 h-10 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {getTitle()}
                    </h1>
                    <p className="text-gray-600">
                        {currentStep === 'email'
                            ? 'Te ayudaremos a recuperar el acceso a tu cuenta'
                            : 'Ingresa el código y tu nueva contraseña'}
                    </p>
                </div>

                {/* Formulario principal */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Botón de regreso */}
                    <div className="mb-6">
                        <button
                            onClick={onBackToLogin}
                            className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al inicio de sesión
                        </button>
                    </div>

                    {/* Mensaje de éxito */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-green-700 text-sm">
                                {successMessage}
                            </span>
                        </div>
                    )}

                    {/* Error general */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <span className="text-red-700 text-sm">
                                {errors.general}
                            </span>
                        </div>
                    )}

                    {/* Indicador de pasos */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    currentStep === 'email'
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'bg-orange-500 border-orange-500 text-white'
                                }`}
                            >
                                <span className="text-sm font-medium">1</span>
                            </div>
                            <div
                                className={`w-8 h-0.5 ${
                                    currentStep === 'code'
                                        ? 'bg-orange-500'
                                        : 'bg-gray-300'
                                }`}
                            ></div>
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    currentStep === 'code'
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'bg-gray-100 border-gray-300 text-gray-400'
                                }`}
                            >
                                <span className="text-sm font-medium">2</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Paso 1: Email */}
                        {currentStep === 'email' && (
                            <>
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
                                                handleInputChange(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                                errors.email
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder="Ingresa tu email para recuperar"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Información del proceso */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        ¿Qué sucederá?
                                    </h4>
                                    <ul className="text-blue-700 text-sm space-y-1">
                                        <li>
                                            • Te enviaremos un código de 6
                                            dígitos
                                        </li>
                                        <li>
                                            • Revisa tu bandeja de entrada y
                                            spam
                                        </li>
                                        <li>
                                            • El código expira en 15 minutos
                                        </li>
                                        <li>
                                            • Podrás crear una nueva contraseña
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {/* Paso 2: Código y nueva contraseña */}
                        {currentStep === 'code' && (
                            <>
                                {/* Información del email */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <p className="text-blue-700 text-sm">
                                        Código enviado a:{' '}
                                        <strong>{formData.email}</strong>
                                    </p>
                                </div>

                                {/* Campo código de verificación */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Código de verificación
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.resetCode}
                                        onChange={e =>
                                            handleInputChange(
                                                'resetCode',
                                                e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 6)
                                            )
                                        }
                                        className={`w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 text-center text-2xl font-mono tracking-widest ${
                                            errors.resetCode
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        placeholder="000000"
                                        maxLength="6"
                                    />
                                    {errors.resetCode && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.resetCode}
                                        </p>
                                    )}

                                    {/* Reenviar código */}
                                    <div className="text-center mt-3">
                                        {countdown > 0 ? (
                                            <p className="text-gray-500 text-sm">
                                                Reenviar código en {countdown}{' '}
                                                segundos
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendCode}
                                                disabled={loading}
                                                className="text-orange-600 text-sm hover:text-orange-700 font-medium disabled:opacity-50"
                                            >
                                                ¿No recibiste el código?
                                                Reenviar
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Nueva contraseña */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={
                                                showNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={formData.newPassword}
                                            onChange={e =>
                                                handleInputChange(
                                                    'newPassword',
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                                errors.newPassword
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Confirmar nueva contraseña */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Confirmar nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={
                                                showConfirmNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={formData.confirmNewPassword}
                                            onChange={e =>
                                                handleInputChange(
                                                    'confirmNewPassword',
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                                errors.confirmNewPassword
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            placeholder="Repite tu nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmNewPassword(
                                                    !showConfirmNewPassword
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmNewPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmNewPassword && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.confirmNewPassword}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Botón principal */}
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
                                    {getButtonText()}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 text-sm">
                        ¿Recordaste tu contraseña?{' '}
                        <button
                            onClick={onBackToLogin}
                            className="text-orange-600 font-medium hover:text-orange-700"
                        >
                            Volver al inicio
                        </button>
                    </p>
                </div>

                {/* Versículo inspiracional */}
                <div className="bg-white bg-opacity-60 rounded-xl p-4 mt-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                        <Heart className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="text-gray-600 text-sm font-medium">
                            Versículo de esperanza
                        </span>
                    </div>
                    <p className="text-gray-700 text-sm italic">
                        "El corazón del hombre planea su camino; mas Jehová
                        endereza sus pasos"
                    </p>
                    <p className="text-orange-600 text-xs font-medium mt-1">
                        Proverbios 16:9
                    </p>
                </div>
            </div>
        </div>
    );
};
