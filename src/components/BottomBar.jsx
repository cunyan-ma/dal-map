import { useState } from 'react'
import './BottomBar.css'

function BottomBar({
    countries = [],
    selectedCompany = null,
    onSelectCompany = () => { },
    selectedCountry = null,
    onSelectCountry = () => { },
}) {
    const [openFilter, setOpenFilter] = useState(null) // null | 'country' | 'company'

    const toggleFilter = (filter) => {
        setOpenFilter(prev => (prev === filter ? null : filter))
    }

    const countryNames = [...new Set(countries.map(r => r.country).filter(Boolean))].sort()
    const companyNames = [...new Set(countries.map(r => r.company).filter(Boolean))].sort()
    const locationCount = countries.filter(r => r.location_lat && r.location_lat !== 'to be completed').length

    return (
        <div className="bottombar">
            {openFilter && (
                <div className="filter-panel">
                    <div className="filter-panel-header">
                        <span>{openFilter === 'country' ? 'Countries' : 'Companies'}</span>
                        <button
                            className="filter-panel-close"
                            onClick={() => {
                                setOpenFilter(null)
                                if (openFilter === 'company') onSelectCompany(null)
                                if (openFilter === 'country') onSelectCountry(null)
                            }}
                        >×</button>
                    </div>
                    <ul className="filter-panel-list">
                        {(openFilter === 'country' ? countryNames : companyNames).map(name => (
                            <li
                                key={name}
                                className={`clickable ${(openFilter === 'company' && name === selectedCompany) ||
                                        (openFilter === 'country' && name === selectedCountry)
                                        ? 'selected'
                                        : ''
                                    }`}
                                onClick={() => {
                                    if (openFilter === 'company') {
                                        onSelectCompany(name === selectedCompany ? null : name)
                                    } else if (openFilter === 'country') {
                                        onSelectCountry(name === selectedCountry ? null : name)
                                    }
                                }}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bottombar-inner">
                <div className="bottombar-title">
                    WHERE ARE THE<br />
                    <span className="bottombar-title-highlight">DATA WORKERS</span><br />
                    BEHIND AI?
                </div>


                <div className="bottombar-description-box">
                    <div className="bottombar-description">
                        Behind the AI systems we use is an enormous web of human labor that span across the globe.
                        Mapped here the are the delivery centers of data annotation companies that are contracted by AI.
                        Workers are often paid 2 dollars per hour or else. navigate the map to find more.
                    </div>
                </div>

                <div className="bottombar-search">
                    <div className="bottombar-search-title">Search by:</div>
                    <button
                        className={`bottombar-search-item ${openFilter === 'company' ? 'active' : ''}`}
                        onClick={() => toggleFilter('company')}
                    >
                        Companies ({companyNames.length})
                    </button>
                    <button
                        className={`bottombar-search-item ${openFilter === 'country' ? 'active' : ''}`}
                        onClick={() => toggleFilter('country')}
                    >
                        Countries ({countryNames.length})
                    </button>
                    <div className="bottombar-search-item">
                        Locations ({locationCount})
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BottomBar
