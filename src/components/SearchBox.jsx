import './SearchBox.css'

function SearchBox({ openFilter, onToggle, platformCount, countryCount, customerCount }) {
    return (
        <div className="search-box">
            <div className="search-box-title">Search by:</div>
            <button
                className={`search-box-item ${openFilter === 'country' ? 'active' : ''}`}
                onClick={() => onToggle('country')}
            >
                Worker Location ({countryCount})
            </button>
            <button
                className={`search-box-item ${openFilter === 'platform' ? 'active' : ''}`}
                onClick={() => onToggle('platform')}
            >
                Platforms ({platformCount})
            </button>
            <button
                className={`search-box-item ${openFilter === 'customer' ? 'active' : ''}`}
                onClick={() => onToggle('customer')}
            >
                Customers ({customerCount})
            </button>
        </div>
    )
}

export default SearchBox
