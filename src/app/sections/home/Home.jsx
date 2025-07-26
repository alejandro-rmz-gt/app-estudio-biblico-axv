import React from 'react';
import {
    BookOpen,
    Calendar,
    Target,
    TrendingUp,
    Clock,
    Heart,
    Share2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';

export const Home = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [userDisplayName, setUserDisplayName] = useState('');

    useEffect(() => {
        console.log('=== 👤 DATOS DEL USUARIO AUTENTICADO ===');
        console.log('Usuario completo:', currentUser);
        console.log('¿Está autenticado?:', isAuthenticated);

        if (currentUser) {
            console.log('📧 Email:', currentUser.email);
            console.log('👤 Nombre:', currentUser.displayName);
            console.log('🆔 UID:', currentUser.uid);
            console.log(
                '📅 Fecha de creación:',
                currentUser.metadata?.creationTime
            );
            console.log('🔐 Email verificado:', currentUser.emailVerified);
            console.log('📱 Proveedor:', currentUser.providerData);

            // Extraer el nombre del usuario
            let displayName = '';
            if (currentUser.displayName) {
                displayName = currentUser.displayName.split(' ')[0]; // Tomar solo el primer nombre
            } else if (currentUser.email) {
                displayName = currentUser.email.split('@')[0]; // Usar la parte antes del @ del email
            } else {
                displayName = 'Usuario'; // Nombre por defecto
            }
            setUserDisplayName(displayName);
        }
        console.log('===========================================');
    }, [currentUser, isAuthenticated]);

    // Función para obtener la hora del día y personalizar el saludo
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    // Función para mostrar cuándo se registró el usuario
    const getAccountAge = () => {
        if (!currentUser?.metadata?.creationTime) return null;

        const creationDate = new Date(currentUser.metadata.creationTime);
        const now = new Date();
        const diffTime = Math.abs(now - creationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Te uniste ayer';
        if (diffDays < 7) return `Te uniste hace ${diffDays} días`;
        if (diffDays < 30)
            return `Te uniste hace ${Math.floor(diffDays / 7)} semanas`;
        return `Te uniste hace ${Math.floor(diffDays / 30)} meses`;
    };

    // Datos simulados (después vendrán de tu API/estado global)
    const userData = {
        currentStreak: 5,
        weeklyProgress: 65,
        lastRead: {
            book: 'Juan',
            chapter: 3,
            verse: 16,
        },
        todayVerse: {
            text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
            reference: 'Juan 3:16',
            version: 'RV60',
        },
        weeklyStats: {
            chaptersRead: 8,
            totalMinutes: 120,
            daysRead: 5,
        },
    };

    // Si no está autenticado, mostrar mensaje
    if (!isAuthenticated || !currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Cargando tu información...
                    </h2>
                    <p className="text-gray-500">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            {/* Header con saludo personalizado */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 pt-12 pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {getGreeting()}, {userDisplayName}!
                        </h1>
                        <p className="text-blue-200 mt-1">
                            Que tengas un día bendecido
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-4 space-y-6">
                {/* Versículo del día */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-400">
                    <div className="flex items-center mb-3">
                        <Heart className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Versículo del día
                        </h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-3 italic">
                        "{userData.todayVerse.text}"
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-medium">
                            {userData.todayVerse.reference}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {userData.todayVerse.version}
                        </span>
                    </div>
                </div>

                {/* Continuar leyendo */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Continuar leyendo
                        </h2>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800 text-lg">
                                    {userData.lastRead.book}{' '}
                                    {userData.lastRead.chapter}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Último versículo: {userData.lastRead.verse}
                                </p>
                            </div>
                            <div className="text-orange-500">
                                <BookOpen className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Continuar leyendo
                    </button>
                </div>

                {/* Devocional de hoy */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <Heart className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Devocional de hoy
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Tema del devocional */}
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
                            <h3 className="font-medium text-gray-800 mb-2">
                                "Confía en Su plan perfecto"
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                Cuando las cosas no salen como esperamos,
                                recordemos que Dios tiene un plan perfecto para
                                cada uno de nosotros.
                            </p>
                            <div className="flex items-center text-orange-600 text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>5 min de lectura</span>
                            </div>
                        </div>

                        {/* Versículo de apoyo */}
                        <div className="border-l-4 border-orange-400 pl-4">
                            <p className="text-gray-700 italic text-sm">
                                "Confía en el Señor de todo corazón, y no en tu
                                propia inteligencia."
                            </p>
                            <span className="text-orange-600 font-medium text-sm">
                                Proverbios 3:5
                            </span>
                        </div>

                        {/* Botón principal */}
                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Leer devocional completo
                        </button>

                        {/* Información del usuario personalizada */}
                        <div className="bg-blue-50 rounded-lg p-3 mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    Registrado como:
                                </span>
                                <span className="font-medium text-blue-700">
                                    {currentUser.email}
                                </span>
                            </div>
                            {currentUser.metadata?.creationTime && (
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <span className="text-gray-600">
                                        Miembro desde:
                                    </span>
                                    <span className="text-blue-600">
                                        {new Date(
                                            currentUser.metadata.creationTime
                                        ).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Espacio extra para el TabBar */}
                <div className="h-4"></div>
            </div>
        </div>
    );
};
