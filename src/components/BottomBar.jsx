import { useState } from 'react'
import SearchBox from './SearchBox'
import FilterPanel from './FilterPanel'
import StoryBox from './StoryBox'
import './BottomBar.css'

function BottomBar({
    countries = [],
    customerEdges = [],
    selectedPlatform = null,
    onSelectPlatform = () => {},
    selectedCountry = null,
    onSelectCountry = () => {},
    selectedCustomer = null,
    onSelectCustomer = () => {},
    onEnterStory = () => {},
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
                        <p>
                            Behind AI is an enormous, deliberately hidden web 
                            of human labor. Data workers are paid as little as 
                            $2 an hour to render data legible to machines--recruited, 
                            often, from places where the poor economic 
                            conditions made such wage appealing.

                        </p>
                        <p>
                           
                            Mapped here are the delivery centers where this 
                            labor happens, the platforms that employ it, and 
                            the customers it serves. Trace the lines between 
                            them to explore the concentration of power behind 
                            AI. Navigate the map for more.
                        </p>
                        
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: 'auto' }}>
                    <StoryBox onEnterStory={onEnterStory} />
                    <SearchBox
                        openFilter={openFilter}
                        onToggle={toggleFilter}
                        platformCount={platformNames.length}
                        countryCount={countryNames.length}
                        customerCount={customerNames.length}
                    />
                </div>
            </div>
        </div>
    )
}

export default BottomBar
