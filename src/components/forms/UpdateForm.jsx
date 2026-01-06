import { useDocumentForm } from '../../contexts/DocumentFormContext';
import ToggleTabs from '../tabs/ToggleTabs';

export const UpdateForm = ({
    updateScope,
    isHtmlEnabled,
    setIsHtmlEnabled,
    isControllerEnabled,
    setIsControllerEnabled,
    resetField,
    resetHTML
}) => {
    const {
        companyID,
        documentID,
        documentContent,
        documentField,
        documentUpdateMode,
        documentNumbers,
        setCompanyID,
        setDocumentID,
        setDocumentContent,
        setDocumentField,
        setDocumentUpdateMode,
        setDocumentNumbers,
        handleFormatContent,
        handleFormatJSON
    } = useDocumentForm();

    return (
        <>
            <div className="rows">
                <p className="txt">Document Number</p>
                <input
                    type="text"
                    className="field-input"
                    value={documentNumbers}
                    onChange={(e) => setDocumentNumbers(e.target.value)}
                />
            </div>

            {updateScope === 'local' && (
                <div className="rows">
                    <p className="txt">
                        Company ID <span className="red-default">*</span>
                    </p>
                    <input
                        type="text"
                        className="field-input"
                        value={companyID}
                        onChange={(e) => setCompanyID(e.target.value)}
                    />
                </div>
            )}
            <div className="rows">
                <p className="txt">
                    Document ID <span className="red-default">*</span>
                </p>
                <input
                    type="text"
                    className="field-input"
                    value={documentID}
                    onChange={(e) => setDocumentID(e.target.value)}
                />
            </div>
            <div className="rows">
                <p className="txt">Update Mode</p>
                <p className="txt">
                    * New document: <span className="fw-bold">0</span>
                </p>
                <p className="txt">
                    * All documents: <span className="fw-bold">1</span>
                </p>
                <ToggleTabs
                    value={documentUpdateMode}
                    setValue={setDocumentUpdateMode}
                    options={[
                        { label: '0', value: 0 },
                        { label: '1', value: 1 }
                    ]}
                />
            </div>
            <div className="rows">
                <div className="flex-between">
                    <p className="txt">Document Content</p>

                    <div className="flexcenter mb-5 gap-5">
                        <ToggleTabs
                            value={isHtmlEnabled}
                            setValue={setIsHtmlEnabled}
                            options={[
                                { label: 'On', value: true },
                                { label: 'Off', value: false }
                            ]}
                        />
                        <div
                            className="btn-default --md"
                            onClick={() => {
                                setDocumentContent('');
                            }}
                        >
                            Clear
                        </div>
                    </div>
                </div>
                <textarea
                    className="field-textarea"
                    name="documentContent"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    onPaste={handleFormatContent}
                ></textarea>
            </div>
            <div className="rows">
                <div className="flex-between">
                    <p className="txt">Document Controller</p>

                    <div className="flexcenter mb-5 gap-5">
                        <ToggleTabs
                            value={isControllerEnabled}
                            setValue={setIsControllerEnabled}
                            options={[
                                { label: 'On', value: true },
                                { label: 'Off', value: false }
                            ]}
                        />
                        <div
                            className="btn-default --md"
                            onClick={() => {
                                setDocumentField('');
                            }}
                        >
                            Clear
                        </div>
                    </div>
                </div>
                <textarea
                    className="field-textarea"
                    name="documentController"
                    value={documentField}
                    onChange={(e) => setDocumentField(e.target.value)}
                    onPaste={handleFormatJSON}
                ></textarea>
            </div>
        </>
    );
};
