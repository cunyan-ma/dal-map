import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import MapView from '../components/MapView'
import BottomBar from '../components/BottomBar'
import Legend from '../components/Legend'
import CompanyInfo from '../components/CompanyInfo'
import CountryInfo from '../components/CountryInfo'

// Use CSV output so Papa.parse fetches raw CSV, not HTML
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTSF7sVqlLv16NeJJJZxSDvxwgUK74I7zm0IDqs8x5Aq1pzSFXlnpIJVXTX4cy0339tXLU7U2GMWFPG/pub?gid=1725569278&single=true&output=csv'

function SupplyChain() {
    const [countries, setCountries] = useState([])
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => { //setting up anything after rendering
        Papa.parse(SHEET_CSV_URL, {
            download: true,
            header: true,
            complete: (results) => setCountries(results.data)
        })
    }, [])

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
        }}>
            <div style={{ flex: 1, paddingBottom: 220 }}> {/* reserve space for bottom bar */}
                <MapView countries={countries} selectedCompany={selectedCompany} selectedCountry={selectedCountry} />
            </div>

            <Legend />

            {selectedCompany && (
                <CompanyInfo
                    company={selectedCompany}
                    countries={countries}
                    onClose={() => setSelectedCompany(null)}
                />
            )}

            {selectedCountry && (
                <CountryInfo
                    country={selectedCountry}
                    countries={countries}
                    onClose={() => setSelectedCountry(null)}
                />
            )}

            <BottomBar
                countries={countries}
                selectedCompany={selectedCompany}
                onSelectCompany={setSelectedCompany}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
            />
        </div>
    )
}

export default SupplyChain