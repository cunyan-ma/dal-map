import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import MapView from '../components/MapView'
import BottomBar from '../components/BottomBar'
import Legend from '../components/Legend'
import PlatformInfo from '../components/PlatformInfo'
import CountryInfo from '../components/CountryInfo'
import CustomerInfo from '../components/CustomerInfo'
import StoryPanel from '../components/StoryPanel'
import ViewModePanel from '../components/ViewModePanel'
import customerCoords from '../data/customerCoords.json'

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTSF7sVqlLv16NeJJJZxSDvxwgUK74I7zm0IDqs8x5Aq1pzSFXlnpIJVXTX4cy0339tXLU7U2GMWFPG/pub?gid=1725569278&single=true&output=csv'
const RELATIONSHIPS_URL = '/dal-map/relationships.csv'

function SupplyChain() {
    const [countries, setCountries] = useState([])
    const [customerEdges, setCustomerEdges] = useState([])
    const [selectedPlatform, setSelectedPlatform] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [viewMode, setViewMode] = useState(null)
    const [storyStep, setStoryStep] = useState(null)

    useEffect(() => {
        Papa.parse(SHEET_CSV_URL, {
            download: true,
            header: true,
            complete: (results) => setCountries(results.data)
        })
    }, [])

    useEffect(() => {
        Papa.parse(RELATIONSHIPS_URL, {
            download: true,
            header: true,
            complete: (results) => {
                const edges = results.data
                    .filter(row => row.relationship_type === 'Customer' && row.source && row.target)
                    .map(row => ({ source: row.source.trim(), target: row.target.trim() }))
                setCustomerEdges(edges)
            }
        })
    }, [])

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
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, paddingBottom: inStory ? 0 : 150, position: 'relative' }}>
                <MapView
                    countries={countries}
                    selectedPlatform={selectedPlatform}
                    selectedCountry={selectedCountry}
                    customerEdges={customerEdges}
                    customerCoords={customerCoords}
                    viewMode={viewMode}
                    storyStep={storyStep}
                    onSelectPlatform={(c) => { setSelectedPlatform(c); setSelectedCountry(null); setSelectedCustomer(null) }}
                    onSelectCountry={(c) => { setSelectedCountry(c); setSelectedPlatform(null); setSelectedCustomer(null) }}
                    onSelectCustomer={(c) => { setSelectedCustomer(c); setSelectedPlatform(null); setSelectedCountry(null) }}
                />
                {!inStory && (
                    <ViewModePanel viewMode={viewMode} onSelect={setViewMode} />
                )}
            </div>

            {!inStory && <Legend />}

            {!inStory && selectedPlatform && (
                <PlatformInfo
                    platform={selectedPlatform}
                    countries={countries}
                    onClose={() => setSelectedPlatform(null)}
                />
            )}

            {!inStory && selectedCountry && (
                <CountryInfo
                    country={selectedCountry}
                    countries={countries}
                    onClose={() => setSelectedCountry(null)}
                />
            )}

            {!inStory && selectedCustomer && (
                <CustomerInfo
                    customer={selectedCustomer}
                    customerEdges={customerEdges}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}

            {!inStory && (
                <BottomBar
                    countries={countries}
                    customerEdges={customerEdges}
                    selectedPlatform={selectedPlatform}
                    onSelectPlatform={setSelectedPlatform}
                    selectedCountry={selectedCountry}
                    onSelectCountry={setSelectedCountry}
                    selectedCustomer={selectedCustomer}
                    onSelectCustomer={setSelectedCustomer}
                    onEnterStory={handleEnterStory}
                />
            )}

            {inStory && (
                <StoryPanel
                    step={storyStep}
                    onStep={setStoryStep}
                    onClose={handleExitStory}
                />
            )}
        </div>
    )
}

export default SupplyChain
