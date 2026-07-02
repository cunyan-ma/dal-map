import './Legend.css'

function Legend() {
    return (
        <div className="legend">
            <div className="legend-item">
                <svg className="legend-swatch legend-swatch-shape" viewBox="0 0 20 20" aria-hidden="true">
                    <polygon points="10,2.5 18.5,18 1.5,18" fill="rgba(255,255,255,0.15)" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                Customer
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-line-customer" />
                Customer contract
            </div>
            <div className="legend-item">
                <svg className="legend-swatch legend-swatch-shape" viewBox="0 0 20 20" aria-hidden="true">
                    <rect x="2" y="2" width="16" height="16" fill="rgba(242,87,45,0.1)" stroke="#f2572d" strokeWidth="1.5" />
                </svg>
                Platform
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-line-worker" />
                Affiliation
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-location" />
                Worker Location
            </div>
            
        </div>
    )
}

export default Legend
