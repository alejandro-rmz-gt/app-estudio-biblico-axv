// src/auth/ExtendedRegister.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Calendar,
    MapPin,
    BookOpen,
    Heart,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
} from 'lucide-react';

export const Register = ({ onSwitchToLogin }) => {
    const [currentStep, setCurrentStep] = useState(1); // 1: Básico, 2: Adicional
    const [formData, setFormData] = useState({
        // Datos básicos (Paso 1)
        name: '',
        email: '',
        password: '',
        confirmPassword: '',

        // Datos adicionales (Paso 2)
        fullName: '',
        birthDate: '',
        country: '',
        notifications: true,
        newsletter: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const { signup } = useAuth();

    // Validación de email
    const validateEmail = email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validación de contraseña
    const validatePassword = password => {
        return password.length >= 6;
    };

    // Validar edad mínima (13 años)
    const validateAge = birthDate => {
        if (!birthDate) return false;
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            return age - 1 >= 13;
        }
        return age >= 13;
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

    // Validar paso 1 (datos básicos)
    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(formData.password)) {
            newErrors.password =
                'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validar paso 2 (datos adicionales)
    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es requerido';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'La fecha de nacimiento es requerida';
        } else if (!validateAge(formData.birthDate)) {
            newErrors.birthDate = 'Debes tener al menos 13 años';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'El país es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Avanzar al siguiente paso
    const handleNextStep = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    // Regresar al paso anterior
    const handlePreviousStep = () => {
        setCurrentStep(1);
        setErrors({});
    };

    // Manejar envío del formulario completo
    const handleSubmit = async e => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);
        setErrors({});

        try {
            // Preparar datos del usuario
            const userData = {
                email: formData.email,
                password: formData.password,
                displayName: formData.name,
                profile: {
                    fullName: formData.fullName,
                    birthDate: formData.birthDate,
                    location: {
                        country: formData.country,
                    },
                    preferences: {
                        notifications: formData.notifications,
                        newsletter: formData.newsletter,
                    },
                    registrationDate: new Date().toISOString(),
                },
            };

            const result = await signup(
                userData.email,
                userData.password,
                userData.displayName,
                userData.profile // Datos adicionales
            );

            if (result.success) {
                console.log('Registro exitoso:', result.user);
                setSuccessMessage(
                    '¡Cuenta creada exitosamente! Bienvenido a nuestra comunidad.'
                );

                // Cambiar a login después de un registro exitoso
                setTimeout(() => {
                    onSwitchToLogin();
                }, 3000);
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setErrors({
                general: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mb-4 shadow-lg">
                    <BookOpen className="w-10 h-10 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Crear Cuenta
                </h1>
                <p className="text-gray-600">Únete a nuestra comunidad de fe</p>

                {/* Indicador de pasos */}
                <div className="flex items-center justify-center mt-4 space-x-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            currentStep >= 1 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                        className={`w-8 h-1 ${
                            currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                        className={`w-3 h-3 rounded-full ${
                            currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Paso {currentStep} de 2
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-700 text-sm">
                            {successMessage}
                        </span>
                    </div>
                )}

                {/* Error general */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">
                            {errors.general}
                        </span>
                    </div>
                )}

                {/* PASO 1: Datos básicos */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Información básica
                        </h3>

                        {/* Nombre */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Nombre de usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e =>
                                        handleInputChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                        errors.name
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="ej: María123"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="tu@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.confirmPassword}
                                    onChange={e =>
                                        handleInputChange(
                                            'confirmPassword',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                        errors.confirmPassword
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Repite tu contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-3"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Botón siguiente */}
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 flex items-center justify-center mt-6"
                        >
                            Continuar
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                )}

                {/* PASO 2: Datos adicionales */}
                {currentStep === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center mb-4">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="mr-3 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Completa tu perfil
                            </h3>
                        </div>

                        {/* Nombre completo */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={e =>
                                    handleInputChange(
                                        'fullName',
                                        e.target.value
                                    )
                                }
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                    errors.fullName
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                }`}
                                placeholder="Tu nombre completo"
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Fecha de nacimiento */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Fecha de nacimiento *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={e =>
                                        handleInputChange(
                                            'birthDate',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                        errors.birthDate
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.birthDate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.birthDate}
                                </p>
                            )}
                        </div>

                        {/* País */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                País *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={e =>
                                        handleInputChange(
                                            'country',
                                            e.target.value
                                        )
                                    }
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent outline-none transition-all duration-200 ${
                                        errors.country
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="México"
                                />
                            </div>
                            {errors.country && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.country}
                                </p>
                            )}
                        </div>

                        {/* Preferencias de notificaciones */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifications"
                                    checked={formData.notifications}
                                    onChange={e =>
                                        handleInputChange(
                                            'notifications',
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label
                                    htmlFor="notifications"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Recibir recordatorios de lectura diaria
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newsletter"
                                    checked={formData.newsletter}
                                    onChange={e =>
                                        handleInputChange(
                                            'newsletter',
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label
                                    htmlFor="newsletter"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Recibir boletín semanal con reflexiones
                                </label>
                            </div>
                        </div>

                        {/* Botón crear cuenta */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center mt-6 ${
                                loading
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Heart className="w-5 h-5 mr-2" />
                                    Crear mi cuenta
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Link para ir al login */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
