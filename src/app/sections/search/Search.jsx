import React, { useState, useEffect } from 'react';
import {
    Search as SearchIcon,
    Filter,
    X,
    Clock,
    Heart,
    Share2,
    BookOpen,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

export const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('todo');
    const [recentSearches, setRecentSearches] = useState([
        'amor',
        'paz',
        'esperanza',
        'fe',
    ]);
    const [favorites, setFavorites] = useState(new Set());

    // Datos simulados de búsqueda (después vendrá de tu API)
    const mockSearchResults = [
        {
            id: 1,
            book: 'Juan',
            chapter: 3,
            verse: 16,
            text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
            version: 'RV60',
            relevance: 95,
        },
        {
            id: 2,
            book: '1 Juan',
            chapter: 4,
            verse: 8,
            text: 'El que no ama, no ha conocido a Dios; porque Dios es amor.',
            version: 'RV60',
            relevance: 90,
        },
        {
            id: 3,
            book: 'Romanos',
            chapter: 8,
            verse: 28,
            text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
            version: 'RV60',
            relevance: 85,
        },
        {
            id: 4,
            book: '1 Corintios',
            chapter: 13,
            verse: 4,
            text: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.',
            version: 'RV60',
            relevance: 80,
        },
    ];

    const filters = [
        { id: 'todo', label: 'Todo', icon: '📖' },
        { id: 'antiguo', label: 'A. Testamento', icon: '📜' },
        { id: 'nuevo', label: 'N. Testamento', icon: '✝️' },
        { id: 'favoritos', label: 'Favoritos', icon: '❤️' },
    ];

    const popularSearches = [
        { term: 'amor de Dios', count: '1.2k' },
        { term: 'paz', count: '890' },
        { term: 'esperanza', count: '756' },
        { term: 'sabiduría', count: '623' },
        { term: 'perdón', count: '554' },
        { term: 'fe', count: '489' },
    ];

    const handleSearch = async query => {
        if (!query.trim()) return;

        setIsSearching(true);

        // Simular búsqueda (después reemplazar con tu API)
        setTimeout(() => {
            const filteredResults = mockSearchResults.filter(result =>
                result.text.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filteredResults);
            setIsSearching(false);

            // Agregar a búsquedas recientes
            if (!recentSearches.includes(query)) {
                setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
            }
        }, 500);
    };

    const toggleFavorite = resultId => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(resultId)) {
            newFavorites.delete(resultId);
        } else {
            newFavorites.add(resultId);
        }
        setFavorites(newFavorites);
    };

    const shareVerse = result => {
        const shareText = `"${result.text}" - ${result.book} ${result.chapter}:${result.verse}`;
        if (navigator.share) {
            navigator.share({ text: shareText });
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    useEffect(() => {
        if (searchQuery.length > 2) {
            const delayedSearch = setTimeout(() => {
                handleSearch(searchQuery);
            }, 300);
            return () => clearTimeout(delayedSearch);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            {/* Header con barra de búsqueda */}
            <div className="bg-white shadow-md sticky top-0 z-40">
                <div className="px-4 py-4">
                    <div className="relative">
                        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
                            <SearchIcon className="w-5 h-5 text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Buscar versículos, palabras, temas..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center mt-3 space-x-2">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    selectedFilter === filter.id
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                            >
                                <span className="mr-1">{filter.icon}</span>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                {/* Estado de carga */}
                {isSearching && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-600">Buscando...</span>
                    </div>
                )}

                {/* Resultados de búsqueda */}
                {searchResults.length > 0 && !isSearching && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Resultados ({searchResults.length})
                            </h2>
                            <span className="text-sm text-gray-500">
                                para "{searchQuery}"
                            </span>
                        </div>

                        {searchResults.map(result => (
                            <div
                                key={result.id}
                                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-400"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                                            {result.book} {result.chapter}:
                                            {result.verse}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {result.version}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm text-gray-500">
                                            {result.relevance}%
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-800 leading-relaxed mb-4 text-lg">
                                    {result.text
                                        .split(
                                            new RegExp(`(${searchQuery})`, 'gi')
                                        )
                                        .map((part, index) =>
                                            part.toLowerCase() ===
                                            searchQuery.toLowerCase() ? (
                                                <mark
                                                    key={index}
                                                    className="bg-yellow-200 px-1 rounded"
                                                >
                                                    {part}
                                                </mark>
                                            ) : (
                                                part
                                            )
                                        )}
                                </p>

                                <div className="flex items-center justify-between">
                                    <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-sm">
                                            Leer capítulo
                                        </span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                toggleFavorite(result.id)
                                            }
                                            className={`p-2 rounded-lg transition-colors ${
                                                favorites.has(result.id)
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${
                                                    favorites.has(result.id)
                                                        ? 'fill-current'
                                                        : ''
                                                }`}
                                            />
                                        </button>

                                        <button
                                            onClick={() => shareVerse(result)}
                                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sin resultados */}
                {searchQuery.length > 2 &&
                    searchResults.length === 0 &&
                    !isSearching && (
                        <div className="text-center py-12">
                            <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                No se encontraron resultados
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Intenta con otras palabras o revisa la
                                ortografía
                            </p>
                            <button
                                onClick={clearSearch}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Nueva búsqueda
                            </button>
                        </div>
                    )}

                {/* Estado inicial - sin búsqueda */}
                {!searchQuery && (
                    <div className="space-y-6">
                        {/* Búsquedas recientes */}
                        {recentSearches.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <div className="flex items-center mb-3">
                                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                                    <h3 className="font-semibold text-gray-800">
                                        Búsquedas recientes
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSearchQuery(search)
                                            }
                                            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Búsquedas populares */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex items-center mb-3">
                                <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
                                <h3 className="font-semibold text-gray-800">
                                    Búsquedas populares
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {popularSearches.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSearchQuery(item.term)
                                        }
                                        className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg hover:from-orange-100 hover:to-yellow-100 transition-all duration-200"
                                    >
                                        <span className="text-gray-700 font-medium text-sm">
                                            {item.term}
                                        </span>
                                        <span className="text-orange-600 text-xs">
                                            {item.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Consejos de búsqueda */}
                        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">
                                💡 Consejos de búsqueda
                            </h3>
                            <ul className="text-blue-700 text-sm space-y-1">
                                <li>
                                    • Busca palabras clave como "amor", "paz",
                                    "esperanza"
                                </li>
                                <li>
                                    • Usa frases específicas: "hijo unigénito"
                                </li>
                                <li>
                                    • Prueba diferentes versiones en los filtros
                                </li>
                                <li>
                                    • Busca en tus favoritos para encontrar
                                    versículos guardados
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
