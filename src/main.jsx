import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './assets/css/common.scss';
import { DocumentFormProvider } from './contexts/DocumentFormContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <DocumentFormProvider>
            <App />
        </DocumentFormProvider>
    </StrictMode>
);
