import './ViewModePanel.css'

const OPTIONS = [
    { id: 'customer-platform-worker', label: 'Customer - Platform - Worker' },
    { id: 'customer-platform',        label: 'Customer - Platform'          },
    { id: 'platform-worker',          label: 'Platform - Worker'            },
]

function ViewModePanel({ viewMode, onSelect }) {
    return (
        <div className="view-mode-panel">
            <div className="view-mode-title">Show relationship</div>
            {OPTIONS.map(({ id, label }) => (
                <button
                    key={id}
                    className={`view-mode-option ${viewMode === id ? 'active' : ''}`}
                    onClick={() => onSelect(viewMode === id ? null : id)}
                >
                    <span className="view-mode-dot" />
                    {label}
                </button>
            ))}
        </div>
    )
}

export default ViewModePanel
