import React, { useState } from 'react';
import {
    Heart,
    Search,
    Filter,
    Share2,
    BookOpen,
    Calendar,
    Tag,
    MoreVertical,
    Edit3,
    Trash2,
    ChevronRight,
    Plus,
    Star as StarIcon,
    Grid3X3,
    List,
} from 'lucide-react';

export const Star = () => {
    const [favorites, setFavorites] = useState([
        {
            id: 1,
            book: 'Juan',
            chapter: 3,
            verse: 16,
            text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
            version: 'RV60',
            category: 'Promesas',
            dateAdded: '2024-01-15',
            note: 'Mi versículo favorito sobre el amor de Dios',
        },
        {
            id: 2,
            book: 'Filipenses',
            chapter: 4,
            verse: 13,
            text: 'Todo lo puedo en Cristo que me fortalece.',
            version: 'RV60',
            category: 'Fortaleza',
            dateAdded: '2024-01-10',
            note: 'Para momentos difíciles',
        },
        {
            id: 3,
            book: 'Salmos',
            chapter: 23,
            verse: 1,
            text: 'Jehová es mi pastor; nada me faltará.',
            version: 'RV60',
            category: 'Paz',
            dateAdded: '2024-01-08',
            note: '',
        },
        {
            id: 4,
            book: 'Romanos',
            chapter: 8,
            verse: 28,
            text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
            version: 'RV60',
            category: 'Promesas',
            dateAdded: '2024-01-05',
            note: 'Recordatorio de que Dios tiene control',
        },
        {
            id: 5,
            book: 'Proverbios',
            chapter: 3,
            verse: 5,
            text: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.',
            version: 'RV60',
            category: 'Sabiduría',
            dateAdded: '2024-01-03',
            note: '',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [sortBy, setSortBy] = useState('recent');
    const [viewMode, setViewMode] = useState('list'); // 'list' o 'grid'
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const categories = [
        'Todos',
        'Promesas',
        'Fortaleza',
        'Paz',
        'Sabiduría',
        'Amor',
        'Fe',
    ];

    const categoryColors = {
        Promesas: 'bg-blue-100 text-blue-700 border-blue-200',
        Fortaleza: 'bg-green-100 text-green-700 border-green-200',
        Paz: 'bg-purple-100 text-purple-700 border-purple-200',
        Sabiduría: 'bg-orange-100 text-orange-700 border-orange-200',
        Amor: 'bg-red-100 text-red-700 border-red-200',
        Fe: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    const sortOptions = [
        { id: 'recent', label: 'Más recientes' },
        { id: 'oldest', label: 'Más antiguos' },
        { id: 'book', label: 'Por libro' },
        { id: 'category', label: 'Por categoría' },
    ];

    const filteredAndSortedFavorites = favorites
        .filter(fav => {
            const matchesSearch =
                fav.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fav.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fav.note.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === 'Todos' ||
                fav.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'book':
                    return a.book.localeCompare(b.book);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

    const removeFavorite = id => {
        setFavorites(prev => prev.filter(fav => fav.id !== id));
        setSelectedFavorite(null);
    };

    const shareVerse = favorite => {
        const shareText = `"${favorite.text}" - ${favorite.book} ${favorite.chapter}:${favorite.verse}`;
        if (navigator.share) {
            navigator.share({ text: shareText });
        }
    };

    const getCategoryStats = () => {
        const stats = {};
        favorites.forEach(fav => {
            stats[fav.category] = (stats[fav.category] || 0) + 1;
        });
        return stats;
    };

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-40">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Favoritos
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {favorites.length} versículo
                                {favorites.length !== 1 ? 's' : ''} guardado
                                {favorites.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    setViewMode(
                                        viewMode === 'list' ? 'grid' : 'list'
                                    )
                                }
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                {viewMode === 'list' ? (
                                    <Grid3X3 className="w-5 h-5" />
                                ) : (
                                    <List className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="relative mb-4">
                        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
                            <Search className="w-5 h-5 text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Buscar en favoritos..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="flex-1 flex overflow-x-auto space-x-2 pb-1">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                        selectedCategory === category
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {category}
                                    {category !== 'Todos' && (
                                        <span className="ml-1 text-xs">
                                            ({getCategoryStats()[category] || 0}
                                            )
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ordenamiento */}
                    <div className="flex items-center justify-between">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-300 outline-none"
                        >
                            {sortOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <span className="text-sm text-gray-500">
                            {filteredAndSortedFavorites.length} resultado
                            {filteredAndSortedFavorites.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                {/* Lista/Grid de favoritos */}
                {filteredAndSortedFavorites.length > 0 ? (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 gap-4'
                                : 'space-y-4'
                        }
                    >
                        {filteredAndSortedFavorites.map(favorite => (
                            <div
                                key={favorite.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-orange-400 hover:shadow-lg transition-shadow"
                            >
                                <div className="p-4">
                                    {/* Header del versículo */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                                                {favorite.book}{' '}
                                                {favorite.chapter}:
                                                {favorite.verse}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                    categoryColors[
                                                        favorite.category
                                                    ] ||
                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                                }`}
                                            >
                                                {favorite.category}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setSelectedFavorite(
                                                    selectedFavorite ===
                                                        favorite.id
                                                        ? null
                                                        : favorite.id
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Texto del versículo */}
                                    <p className="text-gray-800 leading-relaxed mb-3 text-lg">
                                        "{favorite.text}"
                                    </p>

                                    {/* Nota personal */}
                                    {favorite.note && (
                                        <div className="bg-yellow-50 border-l-3 border-yellow-300 px-3 py-2 mb-3 rounded-r-lg">
                                            <p className="text-yellow-800 text-sm italic">
                                                💭 {favorite.note}
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(favorite.dateAdded)}
                                            </div>
                                            <span>•</span>
                                            <span>{favorite.version}</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors">
                                                <BookOpen className="w-4 h-4" />
                                                <span className="text-sm">
                                                    Leer
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Menú de acciones */}
                                    {selectedFavorite === favorite.id && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="grid grid-cols-3 gap-2">
                                                <button className="flex items-center justify-center space-x-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Edit3 className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Editar
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        shareVerse(favorite)
                                                    }
                                                    className="flex items-center justify-center space-x-1 p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Compartir
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        removeFavorite(
                                                            favorite.id
                                                        )
                                                    }
                                                    className="flex items-center justify-center space-x-1 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Eliminar
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Estado vacío */
                    <div className="text-center py-12">
                        {searchQuery || selectedCategory !== 'Todos' ? (
                            /* No hay resultados para el filtro */
                            <>
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    No se encontraron favoritos
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Intenta con otros términos o categorías
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('Todos');
                                    }}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            </>
                        ) : (
                            /* No hay favoritos */
                            <>
                                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    Aún no tienes favoritos
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Cuando encuentres versículos especiales,
                                    márcalos como favoritos para encontrarlos
                                    fácilmente aquí
                                </p>
                                <div className="space-y-3">
                                    <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        Ir a leer
                                    </button>
                                    <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                                        <Search className="w-5 h-5 mr-2" />
                                        Buscar versículos
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Estadísticas rápidas */}
                {favorites.length > 0 && (
                    <div className="mt-8 bg-white rounded-xl shadow-md p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">
                            📊 Resumen de favoritos
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {favorites.length}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Total guardados
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {Object.keys(getCategoryStats()).length}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Categorías
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
