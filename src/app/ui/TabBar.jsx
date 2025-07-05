import React, { useState } from 'react';
import { Home, BookOpen, Search, Star, User } from 'lucide-react';

export const TabBar = () => {
    const [activeTab, setActiveTab] = useState('inicio');

    const tabs = [
        {
            id: 'inicio',
            label: 'Inicio',
            icon: Home,
        },
        {
            id: 'leer',
            label: 'Leer',
            icon: BookOpen,
        },
        {
            id: 'buscar',
            label: 'Buscar',
            icon: Search,
        },
        {
            id: 'favoritos',
            label: 'Favoritos',
            icon: Star,
        },
        {
            id: 'perfil',
            label: 'Perfil',
            icon: User,
        },
    ];

    const handleTabClick = tabId => {
        setActiveTab(tabId);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-4 py-2 z-50 shadow-lg">
            <div className="flex justify-around items-center">
                {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
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
