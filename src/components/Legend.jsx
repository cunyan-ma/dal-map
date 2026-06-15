import './Legend.css'

function Legend() {
    return (
        <div className="legend">
            <div className="legend-title">Legend</div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-company" />
                Companies
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-location" />
                Delivery Center
            </div>
            <div className="legend-item">
                <span className="legend-swatch legend-swatch-line" />
                Affiliation
            </div>
        </div>
    )
}

export default Legend
