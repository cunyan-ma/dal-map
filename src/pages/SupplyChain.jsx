import { useEffect, useState, useMemo } from 'react'
import Papa from 'papaparse'
import MapView from '../components/MapView'
import BottomBar from '../components/BottomBar'
import CornerControls from '../components/CornerControls'
import Legend from '../components/Legend'
import PlatformInfo from '../components/PlatformInfo'
import CountryInfo from '../components/CountryInfo'
import CustomerInfo from '../components/CustomerInfo'
import StoryPanel from '../components/StoryPanel'
import StoryBox from '../components/StoryBox'
import MobileIntro from '../components/MobileIntro'
import './SupplyChain.css'

const PLATFORMS_URL = '/dal-map/dal-platforms.csv'         // orange nodes: platform HQs
const WORKERS_URL = '/dal-map/worker-location.csv'         // red nodes: worker delivery centers
const PLATFORM_CUSTOMER_URL = '/dal-map/platform-customer.csv' // white nodes + white edges

// Promise wrapper around Papa.parse so the two source sheets can be joined once both load.
function parseCsv(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: (results) => resolve(results.data),
            error: reject,
        })
    })
}

// Join worker delivery centers (red) to their platform HQ (orange) and emit the
// denormalized row shape the map + info panels consume:
//   country, location, location_lat, location_long, company, company_lat, company_long
function buildCountryRows(platforms, workers) {
    const platformByName = {}
    platforms.forEach(p => {
        if (p.name) platformByName[p.name.trim()] = p
    })

    return workers
        .filter(w => w.platform && w.lat && w.lng)
        .map(w => {
            const platform = platformByName[w.platform.trim()] || {}
            return {
                country:       w.country,
                location:      w.city,
                location_lat:  w.lat,
                location_long: w.lng,
                company:       w.platform.trim(),
                company_lat:   platform.lat || '',
                company_long:  platform.lng || '',
            }
        })
}

function SupplyChain() {
    const [countries, setCountries] = useState([])
    const [platforms, setPlatforms] = useState([])
    const [customerEdges, setCustomerEdges] = useState([])
    const [customerCoords, setCustomerCoords] = useState({})
    const [selectedPlatform, setSelectedPlatform] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    // Permanent edge layers, toggled from the legend's line rows
    const [showRedEdges, setShowRedEdges] = useState(false)
    const [showWhiteEdges, setShowWhiteEdges] = useState(false)
    const [storyStep, setStoryStep] = useState(null)
    const [barFolded, setBarFolded] = useState(false)

    useEffect(() => {
        Promise.all([parseCsv(PLATFORMS_URL), parseCsv(WORKERS_URL)])
            .then(([platformRows, workers]) => {
                // Keep only platforms with a name and valid coordinates (drops the trailing empty row)
                const cleanPlatforms = platformRows.filter(p => p.name?.trim() && p.lat && p.lng)
                setPlatforms(cleanPlatforms)
                setCountries(buildCountryRows(cleanPlatforms, workers))
            })
    }, [])

    useEffect(() => {
        parseCsv(PLATFORM_CUSTOMER_URL).then(rows => {
            const edges = rows
                .filter(r => r.platform?.trim() && r.customer?.trim())
                .map(r => ({ source: r.platform.trim(), target: r.customer.trim() }))
            setCustomerEdges(edges)

            const coords = {}
            rows.forEach(r => {
                const name = r.customer?.trim()
                const lat = parseFloat(r.lat)
                const lng = parseFloat(r.lng)
                if (name && !coords[name] && Number.isFinite(lat) && Number.isFinite(lng)) {
                    coords[name] = [lat, lng]
                }
            })
            setCustomerCoords(coords)
        })
    }, [])

    // Only keep edges whose source platform is listed in dal-platforms.csv
    const platformNames = useMemo(
        () => new Set(platforms.map(p => p.name.trim())),
        [platforms]
    )
    const filteredCustomerEdges = useMemo(
        () => customerEdges.filter(e => platformNames.has(e.source)),
        [customerEdges, platformNames]
    )

    const handleEnterStory = () => {
        setSelectedPlatform(null)
        setSelectedCountry(null)
        setSelectedCustomer(null)
        setStoryStep(0)
    }

    const handleExitStory = () => {
        setStoryStep(null)
    }

    const inStory = storyStep !== null

    return (
        <div className="supplychain">
            <div className={`map-wrap ${inStory ? 'in-story' : ''} ${barFolded ? 'bar-folded' : ''}`}>
                <MapView
                    countries={countries}
                    platforms={platforms}
                    selectedPlatform={selectedPlatform}
                    selectedCountry={selectedCountry}
                    selectedCustomer={selectedCustomer}
                    customerEdges={filteredCustomerEdges}
                    customerCoords={customerCoords}
                    showRedEdges={showRedEdges}
                    showWhiteEdges={showWhiteEdges}
                    storyStep={storyStep}
                    barFolded={barFolded}
                    onSelectPlatform={(c) => { setSelectedPlatform(c); setSelectedCountry(null); setSelectedCustomer(null) }}
                    onSelectCountry={(c) => { setSelectedCountry(c); setSelectedPlatform(null); setSelectedCustomer(null) }}
                    onSelectCustomer={(c) => { setSelectedCustomer(c); setSelectedPlatform(null); setSelectedCountry(null) }}
                />
                {!inStory && (
                    <div className="map-controls">
                        <Legend
                            showRedEdges={showRedEdges}
                            showWhiteEdges={showWhiteEdges}
                            onToggleRed={() => setShowRedEdges(v => !v)}
                            onToggleWhite={() => setShowWhiteEdges(v => !v)}
                        />
                        <StoryBox onEnterStory={handleEnterStory} />
                    </div>
                )}
            </div>

            {!inStory && selectedPlatform && (
                <PlatformInfo
                    platform={selectedPlatform}
                    countries={countries}
                    onClose={() => setSelectedPlatform(null)}
                    lowered={barFolded}
                />
            )}

            {!inStory && selectedCountry && (
                <CountryInfo
                    country={selectedCountry}
                    countries={countries}
                    onClose={() => setSelectedCountry(null)}
                    lowered={barFolded}
                />
            )}

            {!inStory && selectedCustomer && (
                <CustomerInfo
                    customer={selectedCustomer}
                    customerEdges={filteredCustomerEdges}
                    onClose={() => setSelectedCustomer(null)}
                    lowered={barFolded}
                />
            )}

            {!inStory && (
                <BottomBar
                    folded={barFolded}
                    onToggleFold={() => setBarFolded(f => !f)}
                />
            )}

            {!inStory && (
                <CornerControls
                    countries={countries}
                    customerEdges={filteredCustomerEdges}
                    selectedPlatform={selectedPlatform}
                    onSelectPlatform={setSelectedPlatform}
                    selectedCountry={selectedCountry}
                    onSelectCountry={setSelectedCountry}
                    selectedCustomer={selectedCustomer}
                    onSelectCustomer={setSelectedCustomer}
                    lowered={barFolded}
                />
            )}

            {inStory && (
                <StoryPanel
                    step={storyStep}
                    onStep={setStoryStep}
                    onClose={handleExitStory}
                />
            )}

            <MobileIntro />
        </div>
    )
}

export default SupplyChain
