import './Legend.css'

// Legend merged with the old "Show relationship" panel: the two line rows are
// toggle buttons that show/hide those edges permanently on the map. The ring
// dot on the right fills when a line type is visible.
function Legend({
    showRedEdges = false,
    showWhiteEdges = false,
    onToggleRed = () => {},
    onToggleWhite = () => {},
}) {
    return (
        <div className="legend">
            <div className="legend-title">Legend</div>

            <div className="legend-item">
                <svg className="legend-swatch legend-swatch-shape" viewBox="0 0 20 20" aria-hidden="true">
                    <polygon points="10,2.5 18.5,18 1.5,18" fill="rgba(255,255,255,0.15)" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                Customer
            </div>

            <button
                className="legend-item legend-toggle"
                onClick={onToggleWhite}
                aria-pressed={showWhiteEdges}
                title={showWhiteEdges ? 'Hide customer contract lines' : 'Show customer contract lines'}
            >
                <span className="legend-swatch legend-swatch-line-customer" />
                Customer contract
                <span className={`legend-toggle-dot ${showWhiteEdges ? 'on' : ''}`} />
            </button>

            <div className="legend-item">
                <svg className="legend-swatch legend-swatch-shape" viewBox="0 0 20 20" aria-hidden="true">
                    <rect x="2" y="2" width="16" height="16" fill="rgba(242,87,45,0.1)" stroke="#f2572d" strokeWidth="1.5" />
                </svg>
                Platform
            </div>

            <button
                className="legend-item legend-toggle"
                onClick={onToggleRed}
                aria-pressed={showRedEdges}
                title={showRedEdges ? 'Hide affiliation lines' : 'Show affiliation lines'}
            >
                <span className="legend-swatch legend-swatch-line-worker" />
                Affiliation
                <span className={`legend-toggle-dot ${showRedEdges ? 'on' : ''}`} />
            </button>

            <div className="legend-item">
                <span className="legend-swatch legend-swatch-location" />
                Worker Location
            </div>
        </div>
    )
}

export default Legend
