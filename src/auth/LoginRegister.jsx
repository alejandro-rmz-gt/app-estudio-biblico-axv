// src/auth/AuthContainer.js
import React, { useState } from 'react';
import { Login } from './login/Login';
import { Register } from './register/Register';
import { ForgotPassword } from './ForgotPassword';
import { Heart } from 'lucide-react';

export const LoginRegister = () => {
    const [currentView, setCurrentView] = useState('login');

    const handleSwitchToLogin = () => {
        setCurrentView('login');
    };

    const handleSwitchToRegister = () => {
        setCurrentView('register');
    };  

    const handleForgotPassword = () => {
        setCurrentView('forgot');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Componente según la vista actual */}
                {currentView === 'login' && (
                    <Login
                        onSwitchToRegister={handleSwitchToRegister}
                        onForgotPassword={handleForgotPassword}
                    />
                )}

                {currentView === 'register' && (
                    <Register onSwitchToLogin={handleSwitchToLogin} />
                )}

                {currentView === 'forgot' && (
                    <ForgotPassword onBackToLogin={handleSwitchToLogin} />
                )}

                {/* Versículo inspiracional - Común para todas las vistas */}
                <div className="bg-white bg-opacity-60 rounded-xl p-4 mt-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                        <Heart className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="text-gray-600 text-sm font-medium">
                            Versículo del día
                        </span>
                    </div>
                    <p className="text-gray-700 text-sm italic">
                        "Lámpara es a mis pies tu palabra, y lumbrera a mi
                        camino"
                    </p>
                    <p className="text-orange-600 text-xs font-medium mt-1">
                        Salmos 119:105
                    </p>
                </div>
            </div>
        </div>
    );
};
