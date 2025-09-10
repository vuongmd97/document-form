export default function TabsSwitcher({ tabs, selectedTab, onTabChange }) {
    return (
        <div className="tabs">
            {tabs.map((tab) => (
                <div
                    key={tab.key}
                    className={`tab-items btn-default no-effect --transparent ${
                        selectedTab === tab.key ? 'active' : ''
                    }`}
                    onClick={() => onTabChange(tab.key)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
}
