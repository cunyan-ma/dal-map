import './CustomerInfo.css'

function CustomerInfo({ customer, customerEdges = [], onClose }) {
    const connectedPlatforms = [...new Set(
        customerEdges
            .filter(e => e.target === customer)
            .map(e => e.source)
    )].sort()

    return (
        <div className="customer-info">
            <div className="customer-info-header">
                <span>{customer}</span>
                <button className="customer-info-close" onClick={onClose}>×</button>
            </div>

            <div className="customer-info-description">
                <span>{customer} sources data annotation from {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? 's' : ''}:</span>
            </div>

            <ul className="customer-info-list">
                {connectedPlatforms.map(p => (
                    <li key={p}>{p}</li>
                ))}
            </ul>

            <div className="customer-info-description">
                <span>More information about this customer's data annotation practices will be added here.</span>
            </div>
        </div>
    )
}

export default CustomerInfo
