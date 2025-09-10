export default function ToggleTabs({ classes = '', value = true, setValue, options = [] }) {
    return (
        <div className={`tabs ${classes}`}>
            {options.map((opt, index) => (
                <div
                    key={index}
                    className={`tab-items btn-default no-effect --transparent --sm ${value === opt.value ? 'active' : ''}`}
                    onClick={() => setValue(opt.value)}
                >
                    {opt.label}
                </div>
            ))}
        </div>
    );
}
