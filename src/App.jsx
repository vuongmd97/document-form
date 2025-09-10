import { useState, useRef, useEffect } from 'react';

import { useDocumentForm } from './contexts/DocumentFormContext';
import { InsertForm } from './components/forms/InsertForm';
import { UpdateForm } from './components/forms/UpdateForm';
import TabsSwitcher from './components/tabs/TabsSwitcher';
import Dropdown from './components/dropdown/Dropdown';
import ModalGenerateFile from './components/modals/ModalGenerateFile';
import ModalPasteLinks from './components/modals/ModalPasteLinks';
import ModalImportData from './components/modals/ModalImportData';
import ModalConvertJsonToPHP from './components/modals/ModalConvertJsonToPHP';
import { getCurrentSQL, exportSQL } from './utils/sqlManager';
import { sanitizeNameForSQL } from './utils/sanitizers';

export default function App() {
    const [selectedTab, setSelectedTab] = useState('insert');
    const [updateScope, setUpdateScope] = useState('local');
    const [dropdowns, setDropdowns] = useState({});
    const [showModal, setShowModal] = useState({});
    const [isHtmlEnabled, setIsHtmlEnabled] = useState(true);
    const [isControllerEnabled, setIsControllerEnabled] = useState(true);
    const settingDropdownRef = useRef(null);
    const scopeDropdownRef = useRef(null);

    const {
        companyID,
        companySchema,
        documentID,
        documentName,
        documentContent,
        documentField,
        documentUpdateMode,
        documentNumbers,
        resetDocumentFields
    } = useDocumentForm();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingDropdownRef.current && !settingDropdownRef.current.contains(e.target)) {
                setDropdowns((prev) => ({ ...prev, setting: false }));
            }

            if (scopeDropdownRef.current && !scopeDropdownRef.current.contains(e.target)) {
                setDropdowns((prev) => ({ ...prev, scopeDocument: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const tabs = [
        {
            key: 'insert',
            label: 'INSERT',
            content: <InsertForm updateScope={updateScope} />
        },
        {
            key: 'update',
            label: 'UPDATE',
            content: (
                <UpdateForm
                    updateScope={updateScope}
                    isHtmlEnabled={isHtmlEnabled}
                    setIsHtmlEnabled={setIsHtmlEnabled}
                    isControllerEnabled={isControllerEnabled}
                    setIsControllerEnabled={setIsControllerEnabled}
                />
            )
        }
    ];

    const dropdownOptions = [
        {
            key: 'local',
            label: 'LOCAL'
        },
        {
            key: 'global',
            label: 'GLOBAL'
        }
    ];

    const settingsOptions = [
        {
            key: 'generateFile',
            label: 'Generate Document File'
        },
        {
            key: 'keepUrls',
            label: 'Strip text, keep URLs'
        },
        {
            key: 'importFileSQL',
            label: 'Import SQL Document Data'
        },
        {
            key: 'convertJsonPHP',
            label: 'Convert JSON to PHP Array'
        }
    ];

    const MODALS = {
        generateFile: ModalGenerateFile,
        keepUrls: ModalPasteLinks,
        importFileSQL: ModalImportData,
        convertJsonPHP: ModalConvertJsonToPHP
    };

    const resetAllSettings = () => {
        resetDocumentFields();
        setIsHtmlEnabled(true);
        setIsControllerEnabled(true);
    };

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleOpenModal = (key) => {
        setShowModal((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleScopeChange = (key) => {
        setUpdateScope(key);
    };

    return (
        <div className="app">
            <div className="app__header">
                <Dropdown
                    ref={settingDropdownRef}
                    label="Settings"
                    isOpen={dropdowns['setting']}
                    onToggle={() => toggleDropdown('setting')}
                    onSelect={handleOpenModal}
                    options={settingsOptions}
                />

                <TabsSwitcher tabs={tabs} selectedTab={selectedTab} onTabChange={setSelectedTab} />

                <Dropdown
                    ref={scopeDropdownRef}
                    selectedKey={updateScope}
                    label={dropdownOptions.find((opt) => opt.key === updateScope)?.label || 'Scope'}
                    isOpen={dropdowns['scopeDocument']}
                    onToggle={() => toggleDropdown('scopeDocument')}
                    onSelect={handleScopeChange}
                    options={dropdownOptions}
                />

                <div className="btn-default" onClick={resetAllSettings}>
                    Clear Fields
                </div>

                <div
                    className={`btn-default ml-auto ${(!!documentName && /\d/.test(documentNumbers) && !!documentContent) || !!documentField ? '' : 'is-disable'}`}
                    onClick={() => {
                        exportSQL({
                            updateScope,
                            selectedTab,
                            documentNumbers,
                            companyID,
                            companySchema,
                            documentID,
                            documentName,
                            documentUpdateMode,
                            documentContent,
                            documentField,
                            isHtmlEnabled,
                            isControllerEnabled
                        });
                        resetAllSettings();
                    }}
                >
                    Export SQL
                </div>

                {Object.entries(showModal).map(([key, isOpen]) => {
                    const ModalComponent = MODALS[key];
                    return isOpen && ModalComponent ? (
                        <ModalComponent key={key} handleOpenModal={handleOpenModal} />
                    ) : null;
                })}
            </div>
            <div className="app__container">
                <div className="form">{tabs.find((tab) => tab.key === selectedTab).content}</div>
                <div className="form preview">
                    <textarea
                        className="field-textarea"
                        value={getCurrentSQL({
                            updateScope,
                            selectedTab,
                            documentName: sanitizeNameForSQL(documentName),
                            documentID,
                            documentUpdateMode,
                            documentContent,
                            documentField,
                            isHtmlEnabled,
                            isControllerEnabled,
                            companySchema,
                            companyID
                        })}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}
