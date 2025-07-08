import React, { useState } from 'react';
import { LoginRegister } from './LoginRegister';
import { ForgotPassword } from './ForgotPassword';

export const AuthContainer = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login' or 'forgot-password'

    const handleForgotPassword = () => {
        setCurrentView('forgot-password');
    };

    const handleBackToLogin = () => {
        setCurrentView('login');
    };

    return (
        <>
            {currentView === 'login' && (
                <LoginRegister onForgotPassword={handleForgotPassword} />
            )}

            {currentView === 'forgot-password' && (
                <ForgotPassword onBackToLogin={handleBackToLogin} />
            )}
        </>
    );
};
