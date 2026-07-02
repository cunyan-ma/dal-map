import { useState, useRef, useEffect, useLayoutEffect } from 'react'
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

    // Responsive blurb. The bottom bar has a fixed height so it never grows up
    // into the map. As the window narrows and the blurb would need more height,
    // we step down through three states instead of letting the bar grow:
    //   2 = both paragraphs (default)
    //   1 = second paragraph only
    //   0 = no blurb at all
    const [blurbLevel, setBlurbLevel] = useState(2)
    const [resizeTick, setResizeTick] = useState(0)
    const innerRef = useRef(null)
    const descBoxRef = useRef(null)

    // On any resize, optimistically try to show everything again, then let the
    // layout effect below measure and step back down as needed.
    useEffect(() => {
        const onResize = () => {
            setBlurbLevel(2)
            setResizeTick(t => t + 1)
        }
        window.addEventListener('resize', onResize)
        let ro
        if (innerRef.current && 'ResizeObserver' in window) {
            ro = new ResizeObserver(onResize)
            ro.observe(innerRef.current)
        }
        return () => {
            window.removeEventListener('resize', onResize)
            if (ro) ro.disconnect()
        }
    }, [])

    // Runs before paint after every blurbLevel / resize change: if the blurb
    // overflows the bar's fixed content height, drop a paragraph. This converges
    // (level only decreases) without ever painting an overgrown bar.
    useLayoutEffect(() => {
        const inner = innerRef.current
        const box = descBoxRef.current
        if (!inner || !box) return
        const cs = getComputedStyle(inner)
        const avail = inner.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        const TOLERANCE = 4 // px of slack so the full-width 2-paragraph state holds
        if (box.getBoundingClientRect().height > avail + TOLERANCE && blurbLevel > 0) {
            setBlurbLevel(l => l - 1)
        }
    }, [blurbLevel, resizeTick])

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

            <div className="bottombar-inner" ref={innerRef}>
                <div className="bottombar-title">
                    WHERE ARE THE<br />
                    <span className="bottombar-title-highlight">DATA WORKERS</span><br />
                    BEHIND AI?
                </div>

                {blurbLevel >= 1 && (
                    <div className="bottombar-description-box" ref={descBoxRef}>
                        <div className="bottombar-description">
                            {blurbLevel >= 2 && (
                                <p>
                                    Behind AI is an enormous, deliberately opaque web
                                    of human labor. Data workers are paid as little as
                                    $2 an hour to render data legible to machines--recruited,
                                    often, from places where the poor economic
                                    conditions made such wage appealing.
                                </p>
                            )}
                            <p>
                                Mapped here are the delivery centers where this
                                labor happens, the platforms that employ it, and
                                the customers it serves. Trace the lines between
                                them to explore the concentration of power behind
                                AI. Navigate the map for more.
                            </p>
                        </div>
                    </div>
                )}

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
