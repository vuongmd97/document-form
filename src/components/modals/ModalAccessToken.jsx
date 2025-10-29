import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

const TOKEN_STORAGE_KEY = 'app-token-access';

export default function ModalAccessToken({ handleOpenModal }) {
    const [token, setToken] = useState('');

    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleSave = () => {
        if (!token.trim()) return;

        try {
            localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
        } catch (error) {
            console.log('Save token error', error);
        } finally {
            handleOpenModal('accessToken');
        }
    };

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={() => handleOpenModal('accessToken')}></div>
            <div className="modal__container">
                <div className="header-modal">
                    <span className="header-label">Add Link Token</span>
                    <div className="btn-default --icon-lg" onClick={() => handleOpenModal('accessToken')}>
                        <IonIcon icon={closeOutline} style={{ fontSize: '20px' }} />
                    </div>
                </div>
                <div className="body-modal">
                    <input
                        className="field-input"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                </div>
                <div className="footer-modal">
                    <div className="btn-default" onClick={() => handleOpenModal('accessToken')}>
                        Cancel
                    </div>
                    <div className="btn-default --primary" onClick={handleSave}>
                        Save
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
};
