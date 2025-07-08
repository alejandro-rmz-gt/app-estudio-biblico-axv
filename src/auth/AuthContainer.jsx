// src/auth/AuthContainer.js
import React, { useState } from 'react';
import { LoginRegister } from './LoginRegister';
import { ForgotPassword } from './ForgotPassword';

export const AuthContainer = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login' | 'forgot-password'

    const handleForgotPassword = () => {
        setCurrentView('forgot-password');
    };

    const handleBackToLogin = () => {
        setCurrentView('login');
    };

    return (
        <div>
            {currentView === 'login' && (
                <LoginRegister onForgotPassword={handleForgotPassword} />
            )}

            {currentView === 'forgot-password' && (
                <ForgotPassword onBackToLogin={handleBackToLogin} />
            )}
        </div>
    );
};
