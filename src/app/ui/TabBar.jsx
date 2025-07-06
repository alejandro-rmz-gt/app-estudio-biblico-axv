import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Search, Star, User } from 'lucide-react';

export const TabBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        {
            id: 'inicio',
            label: 'Inicio',
            icon: Home,
            path: '/',
        },
        {
            id: 'leer',
            label: 'Leer',
            icon: BookOpen,
            path: '/leer',
        },
        {
            id: 'buscar',
            label: 'Buscar',
            icon: Search,
            path: '/buscar',
        },
        {
            id: 'favoritos',
            label: 'Favoritos',
            icon: Star,
            path: '/favoritos',
        },
        {
            id: 'perfil',
            label: 'Perfil',
            icon: User,
            path: '/perfil',
        },
    ];

    const handleTabClick = path => {
        navigate(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-4 py-2 z-50 shadow-lg">
            <div className="flex justify-around items-center">
                {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    const isActive = location.pathname === tab.path;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.path)}
                            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                                isActive
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-500 hover:text-orange-400'
                            }`}
                        >
                            <IconComponent
                                size={24}
                                className={`mb-1 ${
                                    isActive
                                        ? 'text-orange-600'
                                        : 'text-gray-500'
                                }`}
                            />
                            <span
                                className={`text-xs font-medium ${
                                    isActive
                                        ? 'text-orange-600'
                                        : 'text-gray-500'
                                }`}
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
