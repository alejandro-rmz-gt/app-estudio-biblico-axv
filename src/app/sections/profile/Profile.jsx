import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    Bell,
    Moon,
    Sun,
    Type,
    Volume2,
    BookOpen,
    Calendar,
    Target,
    TrendingUp,
    Heart,
    Award,
    ChevronRight,
    Edit3,
    LogOut,
    HelpCircle,
    Info,
    Shield,
    Download,
    Share2,
    Star,
    Clock,
    BarChart3,
    AlertCircle,
} from 'lucide-react';

export const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [userData, setUserData] = useState({
        name: currentUser?.displayName || currentUser?.name || 'Usuario',
        email: currentUser?.email || 'email@ejemplo.com',
        avatar: currentUser?.photoURL || null,
        joinDate: currentUser?.metadata?.creationTime || '2024-01-01',
        preferredVersion: 'RV60',
        notifications: {
            dailyReminder: true,
            verseOfDay: true,
            achievements: true,
        },
        appearance: {
            theme: 'light', // 'light', 'dark', 'auto'
            fontSize: 'medium', // 'small', 'medium', 'large'
        },
    });

    const [stats, setStats] = useState({
        totalDaysReading: 45,
        currentStreak: 7,
        longestStreak: 21,
        chaptersRead: 156,
        booksCompleted: 8,
        favoritesCount: 23,
        totalMinutes: 1840,
        achievements: [
            {
                id: 1,
                name: 'Primera lectura',
                icon: '🎉',
                earned: true,
                date: '2024-01-01',
            },
            {
                id: 2,
                name: '7 días seguidos',
                icon: '🔥',
                earned: true,
                date: '2024-01-08',
            },
            {
                id: 3,
                name: 'Primer libro completo',
                icon: '📖',
                earned: true,
                date: '2024-01-15',
            },
            {
                id: 4,
                name: '100 capítulos',
                icon: '💯',
                earned: true,
                date: '2024-02-01',
            },
            {
                id: 5,
                name: '21 días seguidos',
                icon: '⭐',
                earned: true,
                date: '2024-02-15',
            },
            {
                id: 6,
                name: 'Lector dedicado',
                icon: '🏆',
                earned: false,
                date: null,
            },
        ],
    });

    const [showEditProfile, setShowEditProfile] = useState(false);

    const bibleVersions = [
        { id: 'rv60', name: 'Reina Valera 1960', abbr: 'RV60' },
        { id: 'nvi', name: 'Nueva Versión Internacional', abbr: 'NVI' },
        { id: 'tla', name: 'Traducción en Lenguaje Actual', abbr: 'TLA' },
        { id: 'dhh', name: 'Dios Habla Hoy', abbr: 'DHH' },
    ];

    // Función para manejar logout
    const handleLogout = async () => {
        try {
            setError('');
            setLoading(true);

            const result = await logout();

            if (result.success) {
                navigate('/auth');
            } else {
                setError(result.error || 'Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error en logout:', error);
            setError('Error inesperado al cerrar sesión');
        } finally {
            setLoading(false);
        }
    };

    const toggleNotification = type => {
        setUserData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type],
            },
        }));
    };

    const updateAppearance = (setting, value) => {
        setUserData(prev => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                [setting]: value,
            },
        }));
    };

    const formatJoinDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
        });
    };

    const calculateReadingTime = minutes => {
        const hours = Math.floor(minutes / 60);
        return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            {/* Header del perfil */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 pt-12 pb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        {userData.avatar ? (
                            <img
                                src={userData.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-white" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{userData.name}</h1>
                        <p className="text-blue-200 text-sm">
                            {userData.email}
                        </p>
                        <p className="text-blue-300 text-xs mt-1">
                            Miembro desde {formatJoinDate(userData.joinDate)}
                        </p>
                        {/* Estado de verificación de email */}
                        <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                currentUser?.emailVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                            {currentUser?.emailVerified
                                ? '✓ Verificado'
                                : '⚠ Sin verificar'}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEditProfile(true)}
                        className="p-2 bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="px-6 -mt-4 space-y-6">
                {/* Error de logout */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                {/* Estadísticas principales */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <BarChart3 className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Estadísticas de lectura
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                            <div className="text-3xl font-bold text-orange-600">
                                {stats.currentStreak}
                            </div>
                            <div className="text-orange-700 text-sm font-medium">
                                Días seguidos
                            </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600">
                                {stats.chaptersRead}
                            </div>
                            <div className="text-blue-700 text-sm font-medium">
                                Capítulos leídos
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">
                                {stats.totalDaysReading}
                            </div>
                            <div className="text-gray-500 text-xs">
                                Días totales
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">
                                {stats.booksCompleted}
                            </div>
                            <div className="text-gray-500 text-xs">Libros</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">
                                {stats.favoritesCount}
                            </div>
                            <div className="text-gray-500 text-xs">
                                Favoritos
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">
                                {calculateReadingTime(stats.totalMinutes)}
                            </div>
                            <div className="text-gray-500 text-xs">Tiempo</div>
                        </div>
                    </div>
                </div>

                {/* Logros */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Award className="w-5 h-5 text-orange-500 mr-2" />
                            <h2 className="font-semibold text-gray-800">
                                Logros
                            </h2>
                        </div>
                        <span className="text-sm text-gray-500">
                            {stats.achievements.filter(a => a.earned).length}/
                            {stats.achievements.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {stats.achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className={`p-3 rounded-xl text-center transition-all ${
                                    achievement.earned
                                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200'
                                        : 'bg-gray-50 border border-gray-200 opacity-60'
                                }`}
                            >
                                <div className="text-2xl mb-1">
                                    {achievement.icon}
                                </div>
                                <div
                                    className={`text-xs font-medium ${
                                        achievement.earned
                                            ? 'text-yellow-700'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {achievement.name}
                                </div>
                                {achievement.earned && achievement.date && (
                                    <div className="text-xs text-yellow-600 mt-1">
                                        {formatJoinDate(achievement.date)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuración de lectura */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Configuración de lectura
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Versión de la Biblia */}
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-800">
                                    Versión de la Biblia
                                </div>
                                <div className="text-sm text-gray-500">
                                    Versión preferida para leer
                                </div>
                            </div>
                            <select
                                value={userData.preferredVersion}
                                onChange={e =>
                                    setUserData(prev => ({
                                        ...prev,
                                        preferredVersion: e.target.value,
                                    }))
                                }
                                className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"
                            >
                                {bibleVersions.map(version => (
                                    <option
                                        key={version.id}
                                        value={version.abbr}
                                    >
                                        {version.abbr}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Apariencia */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <Settings className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Apariencia
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Tema */}
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-800">
                                    Tema
                                </div>
                                <div className="text-sm text-gray-500">
                                    Claro, oscuro o automático
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                {[
                                    { id: 'light', icon: Sun, label: 'Claro' },
                                    { id: 'dark', icon: Moon, label: 'Oscuro' },
                                    {
                                        id: 'auto',
                                        icon: Settings,
                                        label: 'Auto',
                                    },
                                ].map(theme => {
                                    const IconComponent = theme.icon;
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() =>
                                                updateAppearance(
                                                    'theme',
                                                    theme.id
                                                )
                                            }
                                            className={`p-2 rounded-lg transition-colors ${
                                                userData.appearance.theme ===
                                                theme.id
                                                    ? 'bg-orange-100 text-orange-600'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <IconComponent className="w-4 h-4" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tamaño de fuente */}
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-800">
                                    Tamaño de texto
                                </div>
                                <div className="text-sm text-gray-500">
                                    Pequeño, mediano o grande
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                {[
                                    { id: 'small', label: 'A' },
                                    { id: 'medium', label: 'A' },
                                    { id: 'large', label: 'A' },
                                ].map((size, index) => (
                                    <button
                                        key={size.id}
                                        onClick={() =>
                                            updateAppearance(
                                                'fontSize',
                                                size.id
                                            )
                                        }
                                        className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center ${
                                            userData.appearance.fontSize ===
                                            size.id
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } ${
                                            index === 0
                                                ? 'text-xs'
                                                : index === 1
                                                ? 'text-sm'
                                                : 'text-base'
                                        }`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notificaciones */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <Bell className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="font-semibold text-gray-800">
                            Notificaciones
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-800">
                                    Recordatorio diario
                                </div>
                                <div className="text-sm text-gray-500">
                                    Recibe un recordatorio para leer
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    toggleNotification('dailyReminder')
                                }
                                className={`w-12 h-6 rounded-full transition-colors ${
                                    userData.notifications.dailyReminder
                                        ? 'bg-orange-500'
                                        : 'bg-gray-300'
                                } relative`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                                        userData.notifications.dailyReminder
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-800">
                                    Versículo del día
                                </div>
                                <div className="text-sm text-gray-500">
                                    Recibe el versículo diario
                                </div>
                            </div>
                            <button
                                onClick={() => toggleNotification('verseOfDay')}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                    userData.notifications.verseOfDay
                                        ? 'bg-orange-500'
                                        : 'bg-gray-300'
                                } relative`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                                        userData.notifications.verseOfDay
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium text-gray-800">
                                    Logros
                                </div>
                                <div className="text-sm text-gray-500">
                                    Notificaciones de nuevos logros
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    toggleNotification('achievements')
                                }
                                className={`w-12 h-6 rounded-full transition-colors ${
                                    userData.notifications.achievements
                                        ? 'bg-orange-500'
                                        : 'bg-gray-300'
                                } relative`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                                        userData.notifications.achievements
                                            ? 'translate-x-7'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Otras opciones */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Otras opciones
                    </h2>

                    <div className="space-y-2">
                        {[
                            {
                                icon: Share2,
                                label: 'Compartir la app',
                                action: () => {},
                            },
                            {
                                icon: HelpCircle,
                                label: 'Ayuda y soporte',
                                action: () => {},
                            },
                            {
                                icon: Shield,
                                label: 'Privacidad',
                                action: () => {},
                            },
                            {
                                icon: Info,
                                label: 'Acerca de',
                                action: () => {},
                            },
                        ].map((option, index) => {
                            const IconComponent = option.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={option.action}
                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center">
                                        <IconComponent className="w-5 h-5 text-gray-500 mr-3" />
                                        <span className="text-gray-700">
                                            {option.label}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cerrar sesión */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                            loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-2"></div>
                                Cerrando sesión...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5 mr-2" />
                                Cerrar sesión
                            </>
                        )}
                    </button>
                </div>

                {/* Espacio extra para el TabBar */}
                <div className="h-4"></div>
            </div>
        </div>
    );
};
