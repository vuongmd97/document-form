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
        const sections = text.split(/^--\s+/gm).map((s) => s.trim());
        const map = {};

        for (let i = 1; i < sections.length; i++) {
            const [header, ...contentLines] = sections[i].split('\n');
            const key = header.trim().toUpperCase();
            map[key] = contentLines.join('\n').trim();
        }

        return {
            documentNumbers: map['DOCUMENT_NUMBERS'] || '',
            companyID: map['COMPANY_ID'] || '',
            companySchema: map['COMPANY_SCHEMA'] || '',
            documentUpdateMode: map['DOCUMENT_MODE_UPDATE'] || '',
            documentName: map['DOCUMENT_NAME'] || '',
            documentID: map['DOCUMENT_ID'] || '',
            documentContent: map['DOCUMENT_CONTENT'] || '',
            documentField: map['DOCUMENT_FIELD'] || ''
        };
    };

    const handleFileDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files?.[0];
        if (!file || !file.name.endsWith('.sql')) {
            alert('Please drop a valid .sql file.');
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
                alert('Unable to parse SQL file.');
                return;
            }

            setDocumentNumbers(parsed.documentNumbers || '');
            setCompanyID(parsed.companyID || '');
            setCompanySchema(parsed.companySchema || '');
            setDocumentID(parsed.documentID || '');
            setDocumentName(parsed.documentName || '');
            setDocumentUpdateMode(Number(parsed.documentUpdateMode));
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
                            <p>Drag and drop a SQL file to import data</p>
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
