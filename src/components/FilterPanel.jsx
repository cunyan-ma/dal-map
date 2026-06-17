import './FilterPanel.css'

function FilterPanel({ mode, items, selectedItem, onSelect, onClose }) {
    const title = mode === 'country' ? 'Countries' : mode === 'customer' ? 'Customers' : 'Companies'

    return (
        <div className="filter-panel">
            <div className="filter-panel-header">
                <span>{title}</span>
                <button className="filter-panel-close" onClick={onClose}>×</button>
            </div>
            <ul className="filter-panel-list">
                {items.map(name => (
                    <li
                        key={name}
                        className={`clickable ${name === selectedItem ? 'selected' : ''}`}
                        onClick={() => onSelect(name === selectedItem ? null : name)}
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FilterPanel
