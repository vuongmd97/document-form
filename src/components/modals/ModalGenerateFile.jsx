import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState, useEffect } from 'react';

import { IonIcon } from '@ionic/react';
import { closeOutline, downloadOutline, copyOutline, radioButtonOnOutline, text } from 'ionicons/icons';

import { contentController, getPagesSnippet } from '../../utils/controllers';

export default function ModalGenerateFile({ handleOpenModal }) {
    const [documentName, setDocumentName] = useState('');
    const [documentNumbers, setDocumentNumbers] = useState('docs_');
    const [pageCount, setPageCount] = useState(1);
    const [tooltipText, setTooltipText] = useState('Copy');
    const [renderPages, setRenderPages] = useState(false);
    const [pagesSnippet, setPagesSnippet] = useState('');

    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setTooltipText('Copied');
            setTimeout(() => setTooltipText('Copy'), 800);
        });
    };

    const fileFormat = documentName
        .trim()
        .replace(/['&’.,]/g, '')
        .replace(/[\s\/-]+/g, '_');
    const baseName = fileFormat.replace(/[()]/g, '');

    const fileName = fileFormat;
    const fileController = `${baseName.replace(/_/g, '')}Controller`;
    const fileCssPrint = `print_${baseName.toLowerCase()}`;
    const fileCssPdf = `pdf_${baseName.toLowerCase()}`;

    const exportZip = async () => {
        const zip = new JSZip();
        const folderName = zip.folder(fileName);
        const folderCSSPrint = zip.folder(documentNumbers);
        const folderCSSPdf = folderName.folder(documentNumbers);

        folderCSSPrint.file(`${fileCssPrint}.css`, '');
        folderCSSPdf.file(`${fileCssPdf}.css`, `.wrapper { margin: 0 auto; width: 740px !important; }`);

        for (let i = 1; i <= pageCount; i++) {
            folderName.file(
                `page-${i}.php`,
                `<div class="wrapper wrapper-sizing doc-pb-5">

</div>`
            );
        }

        zip.file(
            `${fileController}.php`,
            contentController({
                fileController,
                fileName,
                fileCssPrint,
                fileCssPdf,
                pageCount,
                documentNumbers
            })
        );

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${documentNumbers}.zip`);
    };

    useEffect(() => {
        setPagesSnippet(getPagesSnippet(pageCount));
    }, [pageCount]);

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={() => handleOpenModal('generateFile')}></div>
            <div className="modal__container">
                <div className="header-modal">
                    <span className="header-label">Generate Document File</span>
                    <div className="btn-default --icon-lg" onClick={() => handleOpenModal('generateFile')}>
                        <IonIcon icon={closeOutline} style={{ fontSize: '20px' }} />
                    </div>
                </div>
                <div className="body-modal">
                    <div className="rows --multi">
                        <div className="col">
                            <p className="txt">Document Number</p>
                            <input
                                type="text"
                                className="field-input"
                                value={documentNumbers}
                                onChange={(e) => setDocumentNumbers(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <div className="flex-between">
                                <p className="txt">Number of Pages</p>
                                <div
                                    className="btn-default --sm tooltip mb-5"
                                    onClick={() => setRenderPages(!renderPages)}
                                >
                                    Preview
                                </div>
                            </div>
                            <input
                                type="number"
                                value={pageCount}
                                onChange={(e) => {
                                    const value = Math.min(Math.max(Number(e.target.value) || 1, 1), 41);
                                    setPageCount(value);
                                }}
                                className="field-input"
                            />
                        </div>
                    </div>
                    <div className="rows">
                        <p className="txt">
                            Document Name <span className="red-default">*</span>
                        </p>
                        <input
                            type="text"
                            className="field-input"
                            value={documentName}
                            onChange={(e) => {
                                const value = e.target.value.trimStart();
                                setDocumentName(value);
                            }}
                            required
                        />
                    </div>
                    {documentName && (
                        <div className="wrap-files">
                            <div className="file flexcenter gap-10">
                                <IonIcon icon={radioButtonOnOutline} />
                                <p className="file-name flex-1 txt-ellipsis">{fileName}</p>
                                <div className="btn-default --icon-lg tooltip" onClick={() => copyText(fileName)}>
                                    <IonIcon icon={copyOutline} style={{ fontSize: '18px' }} />
                                    <span className="tooltiptext">{tooltipText}</span>
                                </div>
                            </div>

                            <div className="file flexcenter gap-10">
                                <IonIcon icon={radioButtonOnOutline} />
                                <p className="file-name flex-1 txt-ellipsis">{fileController}</p>

                                <div className="btn-default --icon-lg tooltip" onClick={() => copyText(fileController)}>
                                    <IonIcon icon={copyOutline} style={{ fontSize: '18px' }} />
                                    <span className="tooltiptext">{tooltipText}</span>
                                </div>
                            </div>

                            <div className="file flexcenter gap-10">
                                <IonIcon icon={radioButtonOnOutline} />
                                <p className="file-name flex-1 txt-ellipsis">{fileCssPrint}</p>

                                <div className="btn-default --icon-lg tooltip" onClick={() => copyText(fileCssPrint)}>
                                    <IonIcon icon={copyOutline} style={{ fontSize: '18px' }} />
                                    <span className="tooltiptext">{tooltipText}</span>
                                </div>
                            </div>

                            <div className="file flexcenter gap-10">
                                <IonIcon icon={radioButtonOnOutline} />
                                <p className="file-name flex-1 txt-ellipsis">{fileCssPdf}</p>

                                <div className="btn-default --icon-lg tooltip" onClick={() => copyText(fileCssPdf)}>
                                    <IonIcon icon={copyOutline} style={{ fontSize: '18px' }} />
                                    <span className="tooltiptext">{tooltipText}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {renderPages && (
                        <div className="flexstart gap-10">
                            <textarea readOnly className="field-textarea large flex-1" value={pagesSnippet}></textarea>

                            <div className="btn-default --icon-lg tooltip" onClick={() => copyText(pagesSnippet)}>
                                <IonIcon icon={copyOutline} style={{ fontSize: '18px' }} />
                                <span className="tooltiptext">{tooltipText}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="footer-modal">
                    <div
                        className={`btn-default has-icon --primary ${documentName ? '' : 'is-disable'}`}
                        onClick={() => {
                            exportZip();
                            handleOpenModal('generateFile');
                        }}
                    >
                        <IonIcon icon={downloadOutline} style={{ fontSize: '18px', marginBottom: '4px' }} />
                        Download
                    </div>
                </div>
            </div>
        </div>
    );
}
