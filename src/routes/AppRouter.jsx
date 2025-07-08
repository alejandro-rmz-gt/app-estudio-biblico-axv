import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from '../app/sections/home/Home';
import { Profile } from '../app/sections/profile/Profile';
import { Read } from '../app/sections/read/Read';
import { Search } from '../app/sections/search/Search';
import { Star } from '../app/sections/star/Star';
import { TabBar } from '../app/ui/TabBar';
import { AuthContainer } from '../auth/AuthContainer';

export const AppRouter = () => {
    return (
        <Router>
            {/* Contenedor principal con padding bottom para el TabBar */}
            <div className="min-h-screen bg-gray-50 pb-20">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/leer" element={<Read />} />
                    <Route path="/buscar" element={<Search />} />
                    <Route path="/favoritos" element={<Star />} />
                    <Route path="/perfil" element={<Profile />} />

                    <Route path="/auth" element={<AuthContainer />} />
                </Routes>

                {/* TabBar siempre visible */}
                <TabBar />
            </div>
        </Router>
    );
};
