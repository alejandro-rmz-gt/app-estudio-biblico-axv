// src/router/AppRouter.js
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Componentes de la app
import { Home } from '../app/sections/home/Home';
import { Profile } from '../app/sections/profile/Profile';
import { Read } from '../app/sections/read/Read';
import { Search } from '../app/sections/search/Search';
import { Star } from '../app/sections/star/Star';
import { TabBar } from '../app/ui/TabBar';

// Componentes de autenticación
import { AuthContainer } from '../auth/AuthContainer';

export const AppRouter = () => {
    return (
        <Router>
            <AuthProvider>
                {/* Contenedor principal */}
                <div className="min-h-screen bg-gray-50">
                    <Routes>
                        {/* Ruta pública de autenticación */}
                        <Route path="/auth" element={<AuthContainer />} />

                        {/* Rutas protegidas */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Home />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/leer"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Read />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/buscar"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Search />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/favoritos"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Star />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/perfil"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Profile />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirigir rutas no encontradas */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

// Componente Layout para rutas autenticadas
const AppLayout = ({ children }) => {
    return (
        <div className="pb-20">
            {children}
            <TabBar />
        </div>
    );
};
