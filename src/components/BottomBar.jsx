import { useState } from 'react'
import SearchBox from './SearchBox'
import FilterPanel from './FilterPanel'
import StoryBox from './StoryBox'
import './BottomBar.css'

function BottomBar({
    countries = [],
    customerEdges = [],
    selectedCompany = null,
    onSelectCompany = () => {},
    selectedCountry = null,
    onSelectCountry = () => {},
    selectedCustomer = null,
    onSelectCustomer = () => {},
    onEnterStory = () => {},
}) {
    const [openFilter, setOpenFilter] = useState(null) // null | 'country' | 'company' | 'customer'

    const countryNames  = [...new Set(countries.map(r => r.country).filter(Boolean))].sort()
    const companyNames  = [...new Set(countries.map(r => r.company).filter(Boolean))].sort()
    const customerNames = [...new Set(customerEdges.map(e => e.target).filter(Boolean))].sort()

    const toggleFilter = (filter) => {
        setOpenFilter(prev => {
            const next = prev === filter ? null : filter
            onSelectCompany(null)
            onSelectCountry(null)
            onSelectCustomer(null)
            return next
        })
    }

    const getFilterItems = () => {
        if (openFilter === 'country')  return countryNames
        if (openFilter === 'company')  return companyNames
        if (openFilter === 'customer') return customerNames
        return []
    }

    const getSelectedItem = () => {
        if (openFilter === 'country')  return selectedCountry
        if (openFilter === 'company')  return selectedCompany
        if (openFilter === 'customer') return selectedCustomer
        return null
    }

    const getOnSelect = () => {
        if (openFilter === 'country')  return onSelectCountry
        if (openFilter === 'company')  return onSelectCompany
        if (openFilter === 'customer') return onSelectCustomer
        return () => {}
    }

    return (
        <div className="bottombar">
            {openFilter && (
                <FilterPanel
                    mode={openFilter}
                    items={getFilterItems()}
                    selectedItem={getSelectedItem()}
                    onSelect={getOnSelect()}
                    onClose={() => toggleFilter(openFilter)}
                />
            )}

            <div className="bottombar-inner">
                <div className="bottombar-title">
                    WHERE ARE THE<br />
                    <span className="bottombar-title-highlight">DATA WORKERS</span><br />
                    BEHIND AI?
                </div>

                <div className="bottombar-description-box">
                    <div className="bottombar-description">
                        <p>Behind AI is an enormous web of human labor across the globe.
                        These data workers are paid under $2/hr to annotate
                        data and render them legible to machines. Data annotation companies 
                        deliberately seek out these workers in countries with
                         worse pay.</p> Mapped here the are the delivery centers of these data annotation companies, representing
                        the demography that these companies systematically exploit. Navigate the map to
                        find out more.
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: 'auto' }}>
                    <StoryBox onEnterStory={onEnterStory} />
                    <SearchBox
                        openFilter={openFilter}
                        onToggle={toggleFilter}
                        companyCount={companyNames.length}
                        countryCount={countryNames.length}
                        customerCount={customerNames.length}
                    />
                </div>
            </div>
        </div>
    )
}

export default BottomBar
