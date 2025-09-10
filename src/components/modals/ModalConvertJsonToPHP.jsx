import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { convertJsonToPhpArray } from '../../utils/convertJsonToPhpArray';

export default function ModalConvertJsonToPHP({ handleOpenModal }) {
    const [jsonValue, setJsonValue] = useState('');
    const [phpArray, setPhpArray] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            const parsed = JSON.parse(jsonValue || '{}');
            const output = convertJsonToPhpArray(parsed);
            setPhpArray(output);
            setError('');
        } catch (err) {
            setPhpArray('');
            setError('JSON is invalid. Please check your input.');
        }
    }, [jsonValue]);

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={() => handleOpenModal('convertJsonPHP')}></div>
            <div className="modal__container">
                <div className="header-modal">
                    <span className="header-label">Convert JSON to PHP Array</span>
                    <div className="btn-default --icon-lg" onClick={() => handleOpenModal('convertJsonPHP')}>
                        <IonIcon icon={closeOutline} style={{ fontSize: '20px' }} />
                    </div>
                </div>
                <div className="body-modal scrolls">
                    <div className="rows">
                        <p className="txt mt-0">
                            Paste your JSON below and it will be converted to a PHP array format.
                        </p>
                        <textarea
                            className="field-textarea large"
                            value={jsonValue}
                            onChange={(e) => setJsonValue(e.target.value)}
                            placeholder="Paste your JSON here..."
                        ></textarea>
                        <p className="txt">Converted PHP Array:</p>
                        {error && <p className="txt red-default mt-0">{error}</p>}
                        <textarea
                            className="field-textarea large"
                            readOnly
                            value={phpArray}
                            placeholder="Converted PHP array will appear here..."
                        ></textarea>
                    </div>
                </div>
                <div className="footer-modal">
                    <div className="btn-default" onClick={() => handleOpenModal('convertJsonPHP')}>
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    );
}
