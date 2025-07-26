import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Settings,
    Heart,
    Share2,
    ChevronDown,
    Sun,
    Moon,
    Type,
    Volume2,
} from 'lucide-react';

export const Read = () => {
    const [currentBook, setCurrentBook] = useState('Juan');
    const [currentChapter, setCurrentChapter] = useState(3);
    const [selectedVerse, setSelectedVerse] = useState(null);
    const [favorites, setFavorites] = useState(new Set([16]));
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState('text-lg');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showBookSelector, setShowBookSelector] = useState(false);

    // Datos simulados del capítulo (después vendrá de tu API)
    const chapterData = {
        book: 'Juan',
        chapter: 3,
        version: 'RV60',
        verses: [
            {
                number: 1,
                text: 'Había un hombre de los fariseos que se llamaba Nicodemo, un principal entre los judíos.',
            },
            {
                number: 2,
                text: 'Este vino a Jesús de noche, y le dijo: Rabí, sabemos que has venido de Dios como maestro; porque nadie puede hacer estas señales que tú haces, si no está Dios con él.',
            },
            {
                number: 3,
                text: 'Respondió Jesús y le dijo: De cierto, de cierto te digo, que el que no naciere de nuevo, no puede ver el reino de Dios.',
            },
            {
                number: 16,
                text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
            },
            {
                number: 17,
                text: 'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.',
            },
            {
                number: 18,
                text: 'El que en él cree, no es condenado; pero el que no cree, ya ha sido condenado, porque no ha creído en el nombre del unigénito Hijo de Dios.',
            },
        ],
    };

    const books = [
        'Génesis',
        'Éxodo',
        'Levítico',
        'Números',
        'Deuteronomio',
        'Mateo',
        'Marcos',
        'Lucas',
        'Juan',
        'Hechos',
        'Romanos',
    ];

    const toggleFavorite = verseNumber => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(verseNumber)) {
            newFavorites.delete(verseNumber);
        } else {
            newFavorites.add(verseNumber);
        }
        setFavorites(newFavorites);
    };

    const shareVerse = verse => {
        const shareText = `"${verse.text}" - ${currentBook} ${currentChapter}:${verse.number}`;
        if (navigator.share) {
            navigator.share({ text: shareText });
        }
    };

    const nextChapter = () => {
        setCurrentChapter(prev => prev + 1);
        setSelectedVerse(null);
    };

    const prevChapter = () => {
        if (currentChapter > 1) {
            setCurrentChapter(prev => prev - 1);
            setSelectedVerse(null);
        }
    };

    const themeClasses = isDarkMode
        ? 'bg-gray-900 text-white'
        : 'bg-gradient-to-br from-blue-50 to-orange-50 text-gray-800';

    return (
        <div className={`min-h-screen ${themeClasses} relative`}>
            {/* Header de navegación */}
            <div
                className={`sticky top-0 z-40 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-md`}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setShowBookSelector(true)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">
                            {currentBook} {currentChapter}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 rounded-lg ${
                                isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            } transition-colors`}
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Panel de configuraciones */}
                {showSettings && (
                    <div
                        className={`border-t ${
                            isDarkMode
                                ? 'border-gray-700 bg-gray-800'
                                : 'border-gray-200 bg-white'
                        } p-4`}
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="flex flex-col items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5 mb-1" />
                                ) : (
                                    <Moon className="w-5 h-5 mb-1" />
                                )}
                                <span className="text-xs text-gray-700">
                                    Tema
                                </span>
                            </button>

                            <button
                                onClick={() =>
                                    setFontSize(
                                        fontSize === 'text-lg'
                                            ? 'text-xl'
                                            : 'text-lg'
                                    )
                                }
                                className="flex flex-col items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Type className="w-5 h-5 mb-1" />
                                <span className="text-xs text-gray-700">
                                    Tamaño
                                </span>
                            </button>

                            <button className="flex flex-col items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                <Volume2 className="w-5 h-5 mb-1" />
                                <span className="text-xs text-gray-700">
                                    Audio
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navegación de capítulos */}
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={prevChapter}
                    disabled={currentChapter === 1}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        currentChapter === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-orange-600 hover:bg-orange-100'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span className="text-sm">Anterior</span>
                </button>

                <div className="text-center">
                    <h1 className="text-xl font-bold">
                        {currentBook} {currentChapter}
                    </h1>
                    <p
                        className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        {chapterData.version}
                    </p>
                </div>

                <button
                    onClick={nextChapter}
                    className="flex items-center px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors"
                >
                    <span className="text-sm">Siguiente</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                </button>
            </div>

            {/* Contenido de los versículos */}
            <div className="px-4 pb-8">
                <div className="space-y-4">
                    {chapterData.verses.map(verse => (
                        <div
                            key={verse.number}
                            className={`p-4 rounded-lg transition-all duration-200 ${
                                selectedVerse === verse.number
                                    ? isDarkMode
                                        ? 'bg-gray-700 border-l-4 border-orange-400'
                                        : 'bg-orange-50 border-l-4 border-orange-400'
                                    : isDarkMode
                                    ? 'bg-gray-800 hover:bg-gray-700'
                                    : 'bg-white hover:bg-gray-50'
                            } ${
                                favorites.has(verse.number)
                                    ? 'ring-2 ring-orange-200'
                                    : ''
                            }`}
                            onClick={() =>
                                setSelectedVerse(
                                    selectedVerse === verse.number
                                        ? null
                                        : verse.number
                                )
                            }
                        >
                            <div className="flex items-start space-x-3">
                                <span
                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                        selectedVerse === verse.number ||
                                        favorites.has(verse.number)
                                            ? 'bg-orange-500 text-white'
                                            : isDarkMode
                                            ? 'bg-gray-600 text-gray-300'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {verse.number}
                                </span>

                                <p
                                    className={`flex-1 leading-relaxed ${fontSize} ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-800'
                                    }`}
                                >
                                    {verse.text}
                                </p>
                            </div>

                            {/* Acciones del versículo */}
                            {selectedVerse === verse.number && (
                                <div className="flex items-center justify-end space-x-3 mt-3 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            toggleFavorite(verse.number);
                                        }}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                                            favorites.has(verse.number)
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${
                                                favorites.has(verse.number)
                                                    ? 'fill-current'
                                                    : ''
                                            }`}
                                        />
                                        <span className="text-sm">
                                            Favorito
                                        </span>
                                    </button>

                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            shareVerse(verse);
                                        }}
                                        className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-sm">
                                            Compartir
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal selector de libros */}
            {showBookSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                    <div
                        className={`w-full ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-t-2xl max-h-96 overflow-y-auto`}
                    >
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Seleccionar libro
                                </h3>
                                <button
                                    onClick={() => setShowBookSelector(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-4">
                            {books.map(book => (
                                <button
                                    key={book}
                                    onClick={() => {
                                        setCurrentBook(book);
                                        setCurrentChapter(1);
                                        setShowBookSelector(false);
                                    }}
                                    className={`p-3 text-left rounded-lg transition-colors ${
                                        book === currentBook
                                            ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                                            : isDarkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    {book}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
