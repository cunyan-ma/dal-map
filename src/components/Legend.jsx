import './Legend.css'

function Legend() {
    return (
        <div className="legend">
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-customer" />
                Customer
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-line-customer" />
                Customer contract
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-company" />
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
