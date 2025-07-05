import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Components
import { App } from './App.jsx';

// UI

// Styles
import './styles/global.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
