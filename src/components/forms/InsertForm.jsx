import { useDocumentForm } from '../../contexts/DocumentFormContext';

export const InsertForm = ({ updateScope }) => {
    const {
        companyID,
        companySchema,
        documentName,
        documentContent,
        documentField,
        documentNumbers,
        setCompanyID,
        setCompanySchema,
        setDocumentName,
        setDocumentContent,
        setDocumentField,
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
                <div className="rows --multi">
                    <div className="col">
                        <p className="txt">
                            Company ID <span className="red-default">*</span>
                        </p>
                        <input
                            type="text"
                            className="field-input"
                            value={companyID}
                            onChange={(e) => setCompanyID(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col">
                        <p className="txt">
                            Company Schema <span className="red-default">*</span>
                        </p>
                        <div className="d-flex gap-5">
                            <input
                                type="text"
                                className="field-input flex-1"
                                value={companySchema}
                                onChange={(e) => setCompanySchema(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="rows">
                <p className="txt">
                    Document Name <span className="red-default">*</span>
                </p>
                <input
                    type="text"
                    className="field-input"
                    value={documentName}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\s{2,}/g, ' ').trimStart();
                        setDocumentName(value);
                    }}
                    required
                />
            </div>

            <div className="rows">
                <p className="txt">Document Content</p>
                <textarea
                    className="field-textarea"
                    name="documentContent"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    onPaste={handleFormatContent}
                ></textarea>
            </div>

            <div className="rows">
                <p className="txt">Document Controller</p>
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
