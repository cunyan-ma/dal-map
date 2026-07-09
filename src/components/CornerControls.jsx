import { useState } from 'react'
import SearchBox from './SearchBox'
import FilterPanel from './FilterPanel'
import './CornerControls.css'

// Search controls floating in the bottom-right corner over the map (moved out
// of the bottom bar so they stay reachable when the bar is folded).
// `lowered` drops the stack to the bottom edge while the bar is folded.
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
        <div className={`corner-controls ${lowered ? 'corner-controls-lowered' : ''}`}>
            {openFilter && (
                <FilterPanel
                    mode={openFilter}
                    items={getFilterItems()}
                    selectedItem={getSelectedItem()}
                    onSelect={getOnSelect()}
                    onClose={() => toggleFilter(openFilter)}
                />
            )}

            <SearchBox
                openFilter={openFilter}
                onToggle={toggleFilter}
                platformCount={platformNames.length}
                countryCount={countryNames.length}
                customerCount={customerNames.length}
            />
        </div>
    )
}

export default CornerControls
