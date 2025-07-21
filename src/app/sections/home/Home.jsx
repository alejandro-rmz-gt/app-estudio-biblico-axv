import React from 'react';
import {
    BookOpen,
    Calendar,
    Target,
    TrendingUp,
    Clock,
    Heart,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';

export const Home = () => {
    const { currentUser, isAuthenticated } = useAuth();

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
        }
        console.log('===========================================');
    }, [currentUser, isAuthenticated]);

    // Datos simulados (después vendrán de tu API/estado global)
    const userData = {
        name: 'María',
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            {/* Header con saludo */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 pt-12 pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            ¡Hola, {userData.name}! 👋
                        </h1>
                        <p className="text-blue-200 mt-1">
                            Que tengas un día bendecido
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center text-yellow-300">
                            <Target className="w-5 h-5 mr-1" />
                            <span className="text-lg font-bold">
                                {userData.currentStreak}
                            </span>
                        </div>
                        <p className="text-blue-200 text-sm">días seguidos</p>
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

                {/* Progreso semanal */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                            <h2 className="font-semibold text-gray-800">
                                Progreso esta semana
                            </h2>
                        </div>
                        <span className="text-orange-600 font-bold text-lg">
                            {userData.weeklyProgress}%
                        </span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${userData.weeklyProgress}%` }}
                        ></div>
                    </div>

                    {/* Stats semanales */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                                {userData.weeklyStats.chaptersRead}
                            </div>
                            <div className="text-gray-500 text-sm">
                                Capítulos
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                                {userData.weeklyStats.totalMinutes}
                            </div>
                            <div className="text-gray-500 text-sm">Minutos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                                {userData.weeklyStats.daysRead}
                            </div>
                            <div className="text-gray-500 text-sm">Días</div>
                        </div>
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

                {/* Accesos rápidos */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Accesos rápidos
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                            <span className="text-blue-800 font-medium text-sm">
                                Plan de lectura
                            </span>
                        </button>

                        <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200">
                            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
                            <span className="text-yellow-800 font-medium text-sm">
                                Devocional
                            </span>
                        </button>
                    </div>
                </div>

                {/* Espacio extra para el TabBar */}
                <div className="h-4"></div>
            </div>
        </div>
    );
};
