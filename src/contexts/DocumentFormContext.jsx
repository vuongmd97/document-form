import { createContext, useContext, useState } from 'react';
import { formatTextFromClipboard, formatJSONFromClipboard } from '../utils/FormatClipboardUtils';

const DocumentFormContext = createContext();

export const DocumentFormProvider = ({ children }) => {
    const [companyID, setCompanyID] = useState('');
    const [companySchema, setCompanySchema] = useState('gorilladesk');
    const [documentID, setDocumentID] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [documentContent, setDocumentContent] = useState('');
    const [documentField, setDocumentField] = useState('');
    const [documentUpdateMode, setDocumentUpdateMode] = useState(0);
    const [documentNumbers, setDocumentNumbers] = useState('Docs#');

    const resetDocumentFields = () => {
        setCompanyID('');
        setCompanySchema('gorilladesk');
        setDocumentID('');
        setDocumentName('');
        setDocumentContent('');
        setDocumentField('');
        setDocumentUpdateMode(0);
        setDocumentNumbers('Docs#');
    };

    const handleFormatContent = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const replaced = formatTextFromClipboard(pastedText);
        const newValue =
            documentContent.slice(0, e.target.selectionStart) + replaced + documentContent.slice(e.target.selectionEnd);
        setDocumentContent(newValue);
    };

    const handleFormatJSON = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        try {
            const formatted = formatJSONFromClipboard(pastedText);
            setDocumentField(formatted);
        } catch (err) {
            alert('Pasted content is not valid JSON.');
        }
    };

    return (
        <DocumentFormContext.Provider
            value={{
                // State values
                companyID,
                companySchema,
                documentID,
                documentName,
                documentContent,
                documentField,
                documentUpdateMode,
                documentNumbers,
                // Setters
                setCompanyID,
                setCompanySchema,
                setDocumentID,
                setDocumentName,
                setDocumentContent,
                setDocumentField,
                setDocumentUpdateMode,
                setDocumentNumbers,
                // Utility functions
                resetDocumentFields,
                handleFormatContent,
                handleFormatJSON
            }}
        >
            {children}
        </DocumentFormContext.Provider>
    );
};

export const useDocumentForm = () => useContext(DocumentFormContext);
