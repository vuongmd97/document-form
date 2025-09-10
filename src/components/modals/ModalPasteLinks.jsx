import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

export default function ModalPasteLinks({ handleOpenModal }) {
    const [extractedLinks, setExtractedLinks] = useState('');

    const extractLinksOnPaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        const links = pastedText
            .split('\n')
            .map((line) => line.match(/https?:\/\/[^\s]+/)?.[0])
            .filter(Boolean);

        const finalText = links.join('\n');
        setExtractedLinks(finalText);
    };

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={() => handleOpenModal('keepUrls')}></div>
            <div className="modal__container">
                <div className="header-modal">
                    <span className="header-label">Extract Links On Paste</span>
                    <div className="btn-default --icon-lg" onClick={() => handleOpenModal('keepUrls')}>
                        <IonIcon icon={closeOutline} style={{ fontSize: '20px' }} />
                    </div>
                </div>
                <div className="body-modal">
                    <div className="rows">
                        <p className="txt">Paste any text below — only links will be extracted</p>
                        <textarea
                            className="field-textarea large"
                            value={extractedLinks}
                            onPaste={extractLinksOnPaste}
                            placeholder="Paste text with links here..."
                            onChange={(e) => setExtractedLinks(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div className="footer-modal">
                    <div className="btn-default" onClick={() => handleOpenModal('keepUrls')}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
}
