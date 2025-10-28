import { IonIcon } from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { forwardRef } from 'react';

const Dropdown = forwardRef(
    ({ label, isOpen, selectedKey = '', options = [], onToggle, onSelect, className = '' }, ref) => {
        return (
            <div ref={ref} className={`dropdown ${isOpen ? 'active' : ''} ${className}`}>
                <div className="btn-default" onClick={onToggle}>
                    {label}
                    <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                </div>
                <div className="dropdown__menu content-full">
                    {options.map((opt) => (
                        <div
                            key={opt.key}
                            className={`items ${selectedKey === opt.key ? 'active' : ''}`}
                            onClick={() => {
                                if (!opt.src) {
                                    onSelect(opt.key);
                                    onToggle();
                                }
                            }}
                        >
                            {opt.src !== '' ? (
                                <a href={opt.src} target="_blank">
                                    {opt.label}
                                </a>
                            ) : (
                                opt.label
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

export default Dropdown;
