import { useState, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useDocumentForm } from '../../contexts/DocumentFormContext';

export default function ModalImportData({ handleOpenModal }) {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const {
        setCompanyID,
        setCompanySchema,
        setDocumentID,
        setDocumentName,
        setDocumentContent,
        setDocumentField,
        setDocumentUpdateMode,
        setDocumentNumbers
    } = useDocumentForm();

    const parseSqlFile = (text) => {
        const result = {
            documentNumbers: '',
            companyID: '',
            companySchema: '',
            documentUpdateMode: '',
            documentName: '',
            documentID: '',
            documentContent: '',
            documentField: ''
        };

        // Extract document numbers from class name
        const classMatch = text.match(/class m\d+_\d+_(\d+)_/);
        if (classMatch) {
            result.documentNumbers = classMatch[1];
        }

        // Extract schema
        const schemaMatch = text.match(/\$schema\s*=\s*['"]([^'"]+)['"]/);
        if (schemaMatch) {
            result.companySchema = schemaMatch[1];
        }

        // Extract userId (companyID)
        const userIdMatch = text.match(/\$userId\s*=\s*(\d+)/);
        if (userIdMatch) {
            result.companyID = userIdMatch[1];
        }

        // Extract ownerId (for update mode)
        const ownerIdMatch = text.match(/\$ownerId\s*=\s*(\d+)/);
        if (ownerIdMatch) {
            result.companyID = ownerIdMatch[1];
        }

        // Extract documentId
        const docIdMatch = text.match(/\$(?:userDocumentsId|documentId)\s*=\s*(\d+)/);
        if (docIdMatch) {
            result.documentID = docIdMatch[1];
        }

        // Extract updateAll mode
        const updateAllMatch = text.match(/\$updateAll\s*=\s*(\d+)/);
        if (updateAllMatch) {
            result.documentUpdateMode = updateAllMatch[1];
        }

        // Extract name
        const nameMatch = text.match(/\$name\s*=\s*['"]([^'"]*)['"]/);
        if (nameMatch) {
            result.documentName = nameMatch[1];
        }

        // Extract content - handle both single and double quotes, multiline
        const contentMatch = text.match(/\$content\s*=\s*['"]([^]*?)['"];\s*(?:\$fields|\n)/);
        if (contentMatch) {
            result.documentContent = contentMatch[1];
        }

        // Extract fields - handle both single and double quotes, multiline
        const fieldsMatch = text.match(/\$fields\s*=\s*['"]([^]*?)['"];/);
        if (fieldsMatch) {
            result.documentField = fieldsMatch[1];
        }

        return result;
    };

    const handleFileDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files?.[0];
        if (!file || !file.name.endsWith('.php')) {
            alert('Please drop a valid .php file.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target.result;

            if (typeof content !== 'string') {
                alert('Unable to read file content.');
                return;
            }

            const parsed = parseSqlFile(content);
            if (!parsed) {
                alert('Unable to parse PHP file.');
                return;
            }

            setDocumentNumbers(parsed.documentNumbers || '');
            setCompanyID(parsed.companyID || '');
            setCompanySchema(parsed.companySchema || '');
            setDocumentID(parsed.documentID || '');
            setDocumentName(parsed.documentName || '');
            setDocumentUpdateMode(Number(parsed.documentUpdateMode) || 0);
            setDocumentContent(parsed.documentContent || '');
            setDocumentField(parsed.documentField || '');
        };

        reader.readAsText(file);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragging(false);
        handleFileDrop(e);
        handleOpenModal('importFileSQL');
    };

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={() => handleOpenModal('importFileSQL')}></div>
            <div className="modal__container">
                <div className="header-modal">
                    <span className="header-label">Import SQL Document Data</span>
                    <div className="btn-default --icon-lg" onClick={() => handleOpenModal('importFileSQL')}>
                        <IonIcon icon={closeOutline} style={{ fontSize: '20px' }} />
                    </div>
                </div>
                <div className="body-modal p-0">
                    <div
                        className={`dropzone ${isDragging ? 'active' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <div className="dropzone__container">
                            <p>Drag and drop a PHP file to import data</p>
                        </div>
                    </div>
                </div>
                <div className="footer-modal">
                    <div className="btn-default" onClick={() => handleOpenModal('importFileSQL')}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
}
