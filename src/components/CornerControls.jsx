import { useState } from 'react'
import SearchBox from './SearchBox'
import FilterPanel from './FilterPanel'
import './CornerControls.css'

// Search controls docked top-right beneath the navbar. The filter list opens
// anchored to the bottom-right corner, mirroring the info panels bottom-left,
// and rides the bottom-bar fold (`lowered`) the same way they do.
function CornerControls({
    countries = [],
    customerEdges = [],
    selectedPlatform = null,
    onSelectPlatform = () => {},
    selectedCountry = null,
    onSelectCountry = () => {},
    selectedCustomer = null,
    onSelectCustomer = () => {},
    lowered = false,
}) {
    const [openFilter, setOpenFilter] = useState(null) // null | 'country' | 'platform' | 'customer'

    const countryNames  = [...new Set(countries.map(r => r.country).filter(Boolean))].sort()
    const platformNames = [...new Set(countries.map(r => r.company).filter(Boolean))].sort()
    const customerNames = [...new Set(customerEdges.map(e => e.target).filter(Boolean))].sort()

    const toggleFilter = (filter) => {
        setOpenFilter(prev => {
            const next = prev === filter ? null : filter
            onSelectPlatform(null)
            onSelectCountry(null)
            onSelectCustomer(null)
            return next
        })
    }

    const getFilterItems = () => {
        if (openFilter === 'country')  return countryNames
        if (openFilter === 'platform') return platformNames
        if (openFilter === 'customer') return customerNames
        return []
    }

    const getSelectedItem = () => {
        if (openFilter === 'country')  return selectedCountry
        if (openFilter === 'platform') return selectedPlatform
        if (openFilter === 'customer') return selectedCustomer
        return null
    }

    const getOnSelect = () => {
        if (openFilter === 'country')  return onSelectCountry
        if (openFilter === 'platform') return onSelectPlatform
        if (openFilter === 'customer') return onSelectCustomer
        return () => {}
    }

    return (
        <>
            <div className="search-dock">
                <SearchBox
                    openFilter={openFilter}
                    onToggle={toggleFilter}
                    platformCount={platformNames.length}
                    countryCount={countryNames.length}
                    customerCount={customerNames.length}
                />
            </div>

            {openFilter && (
                <FilterPanel
                    mode={openFilter}
                    items={getFilterItems()}
                    selectedItem={getSelectedItem()}
                    onSelect={getOnSelect()}
                    onClose={() => toggleFilter(openFilter)}
                    lowered={lowered}
                />
            )}
        </>
    )
}

export default CornerControls
