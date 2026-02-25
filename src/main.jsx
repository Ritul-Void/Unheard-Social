import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './hooks/useAuth';
import { CustomizationProvider } from './hooks/useCustomization';
createRoot(document.getElementById('root')).render(React.createElement(StrictMode, null, React.createElement(CustomizationProvider, null, React.createElement(AuthProvider, null, React.createElement(App, null)))));
