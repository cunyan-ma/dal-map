import './FilterPanel.css'

function FilterPanel({ mode, items, selectedItem, onSelect, onClose, lowered = false }) {
    const title = mode === 'country' ? 'Countries' : mode === 'customer' ? 'Customers' : 'Platforms'

    return (
        <div className={`filter-panel ${lowered ? 'lowered' : ''}`}>
            <div className="filter-panel-header">
                <span>{title}</span>
                <button className="filter-panel-close" onClick={onClose}>×</button>
            </div>
            <ul className="filter-panel-list">
                {items.map(name => (
                    <li key={name}>
                        <button
                            type="button"
                            className={`filter-panel-item ${name === selectedItem ? 'selected' : ''}`}
                            aria-pressed={name === selectedItem}
                            onClick={() => onSelect(name === selectedItem ? null : name)}
                        >
                            {name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FilterPanel
