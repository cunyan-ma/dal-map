import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import STORY_BEATS from '../data/storyBeats.js'

const COMPANY_ALIASES = {
    'Samasource Impact Sourcing': 'Sama',
    'Keymakr Data Labeling': 'Keymakr',
    'Innodata': 'Innodata',
}

function normalizeName(name) {
    return name.replace(/,?\s+(Inc\.?|LLC\.?|Ltd\.?|Corp\.?|Co\.?)$/i, '').trim()
}

function buildCompanyLatLng(countries) {
    const result = {}
    countries.forEach(row => {
        if (row.company && row.company_lat && row.company_long) {
            const coords = [parseFloat(row.company_lat), parseFloat(row.company_long)]
            const name = row.company.trim()
            const normalized = normalizeName(name)
            result[name] = coords
            result[normalized] = coords
            if (COMPANY_ALIASES[normalized]) {
                result[COMPANY_ALIASES[normalized]] = coords
            }
        }
    })
    return result
}

// Default opacities for each node type
const DEFAULTS = {
    red:    { fillOpacity: 0.8,  opacity: 0.7 },
    orange: { fillOpacity: 0.15, opacity: 1   },
    white:  { fillOpacity: 0.3,  opacity: 0.5 },
}
const HIGHLIGHT = {
    red:    { fillOpacity: 0.95, opacity: 1   },
    orange: { fillOpacity: 0.85, opacity: 1   },
    white:  { fillOpacity: 0.9,  opacity: 1   },
}
const DIMMED = {
    red:    { fillOpacity: 0.04, opacity: 0.04 },
    orange: { fillOpacity: 0.03, opacity: 0.04 },
    white:  { fillOpacity: 0.04, opacity: 0.04 },
}

function MapView({
    countries,
    selectedCompany = null,
    selectedCountry = null,
    customerEdges = [],
    customerCoords = {},
    viewMode = 'platform-worker',
    storyStep = null,
    onSelectCompany = () => {},
    onSelectCountry = () => {},
    onSelectCustomer = () => {},
}) {
    const containerRef = useRef(null)
    const mapRef = useRef(null)

    // Story mode layers (rebuilt on story step change)
    const storyLayersRef = useRef([])

    // Normal mode marker collections (rebuilt when data changes)
    const redMarkersRef = useRef([])    // [{ marker, row }]
    const orangeMarkersRef = useRef([]) // [{ marker, company, lat, lng }]
    const whiteMarkersRef = useRef([])  // [{ marker, name, coords }]

    // Dynamically added hover edges (cleared on mouseout)
    const hoverEdgesRef = useRef([])

    // Permanent edges drawn for the active viewMode
    const viewModeEdgesRef = useRef([])

    // Pre-computed relationship maps
    const relRef = useRef(null)

    useEffect(() => {
        const map = L.map(containerRef.current).setView([20, 0], 2)
        mapRef.current = map

        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map)

        return () => { map.remove() }
    }, [])

    // Build relationship maps whenever data changes
    useEffect(() => {
        if (countries.length === 0 || customerEdges.length === 0) return

        const redByCompany = {}   // company → [rows]
        const orangeByName = {}   // company → [lat, lng]

        countries.forEach(row => {
            if (row.location_lat && row.location_lat !== 'to be completed' &&
                row.location_long && row.company) {
                if (!redByCompany[row.company]) redByCompany[row.company] = []
                redByCompany[row.company].push(row)
            }
            if (row.company && row.company_lat && row.company_long) {
                orangeByName[row.company] = [parseFloat(row.company_lat), parseFloat(row.company_long)]
            }
        })

        const custEdgesBySource = {} // orange company → [customer names]
        const custEdgesByTarget = {} // customer name   → [orange companies]
        customerEdges.forEach(e => {
            if (!custEdgesBySource[e.source]) custEdgesBySource[e.source] = []
            custEdgesBySource[e.source].push(e.target)
            if (!custEdgesByTarget[e.target]) custEdgesByTarget[e.target] = []
            custEdgesByTarget[e.target].push(e.source)
        })

        relRef.current = { redByCompany, orangeByName, custEdgesBySource, custEdgesByTarget }
    }, [countries, customerEdges])

    // ── Story mode layer rendering ───────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map || countries.length === 0 || storyStep === null) return

        storyLayersRef.current.forEach(l => map.removeLayer(l))
        storyLayersRef.current = []

        const { nodeFilter, highlightCountries } = STORY_BEATS[storyStep]

        const workerRows = countries.filter(row =>
            row.location_lat && row.location_long &&
            row.location_lat !== 'to be completed' &&
            row.company_lat && row.company_long
        )

        if (nodeFilter === 'red' || nodeFilter === 'all') {
            workerRows.forEach(row => {
                const highlighted = !highlightCountries || highlightCountries.includes(row.country)
                const marker = L.circleMarker(
                    [parseFloat(row.location_lat), parseFloat(row.location_long)],
                    { radius: 10, fillColor: '#c51818', color: '#c51818', weight: 1,
                      fillOpacity: highlighted ? 0.85 : 0.05, opacity: highlighted ? 0.9 : 0.05 }
                ).addTo(map)
                storyLayersRef.current.push(marker)
            })
        }

        if (nodeFilter === 'all') {
            const seen = new Set()
            workerRows.forEach(row => {
                if (seen.has(row.company)) return
                seen.add(row.company)
                const marker = L.circleMarker(
                    [parseFloat(row.company_lat), parseFloat(row.company_long)],
                    { radius: 10, fillColor: '#f2572d', color: '#f2572d', weight: 1,
                      fillOpacity: 0.2, opacity: 1 }
                ).addTo(map)
                storyLayersRef.current.push(marker)
            })
        }

        if (nodeFilter === 'white' || nodeFilter === 'all') {
            const companyLatLng = buildCompanyLatLng(countries)
            const mapNames = new Set(Object.keys(companyLatLng))
            const validEdges = customerEdges.filter(e => mapNames.has(e.source) && customerCoords[e.target])
            const rendered = new Set()
            validEdges.forEach(edge => {
                if (rendered.has(edge.target)) return
                rendered.add(edge.target)
                const marker = L.circleMarker(customerCoords[edge.target], {
                    radius: 8, fillColor: '#ffffff', color: '#ffffff', weight: 1,
                    fillOpacity: 0.35, opacity: 0.6
                }).addTo(map)
                storyLayersRef.current.push(marker)
            })
        }
    }, [storyStep, countries, customerEdges, customerCoords])

    // Clean up story layers when exiting story mode
    useEffect(() => {
        if (storyStep !== null) return
        const map = mapRef.current
        if (!map) return
        storyLayersRef.current.forEach(l => map.removeLayer(l))
        storyLayersRef.current = []
    }, [storyStep])

    // ── Normal mode layer rendering ──────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map || countries.length === 0) return

        // Clear previous normal-mode markers
        redMarkersRef.current.forEach(({ marker }) => map.removeLayer(marker))
        orangeMarkersRef.current.forEach(({ marker }) => map.removeLayer(marker))
        whiteMarkersRef.current.forEach(({ marker }) => map.removeLayer(marker))
        hoverEdgesRef.current.forEach(l => map.removeLayer(l))
        redMarkersRef.current = []
        orangeMarkersRef.current = []
        whiteMarkersRef.current = []
        hoverEdgesRef.current = []

        const workerRows = countries.filter(row =>
            row.location_lat && row.location_long &&
            row.location_lat !== 'to be completed' &&
            row.company_lat && row.company_long
        )

        // --- Shared hover helpers ---

        const clearHover = () => {
            hoverEdgesRef.current.forEach(l => map.removeLayer(l))
            hoverEdgesRef.current = []
            redMarkersRef.current.forEach(({ marker }) => marker.setStyle(DEFAULTS.red))
            orangeMarkersRef.current.forEach(({ marker }) => marker.setStyle(DEFAULTS.orange))
            whiteMarkersRef.current.forEach(({ marker }) => marker.setStyle(DEFAULTS.white))
        }

        const addEdge = (from, to, color) => {
            const line = L.polyline([from, to], { color, weight: 1.5, opacity: 0.75, smoothFactor: 1 }).addTo(map)
            hoverEdgesRef.current.push(line)
        }

        // --- Red nodes ---
        workerRows.forEach(row => {
            const lat = parseFloat(row.location_lat)
            const lng = parseFloat(row.location_long)
            const marker = L.circleMarker([lat, lng], {
                radius: 10, fillColor: '#c51818', color: '#c51818', weight: 1,
                ...DEFAULTS.red
            })

            marker.on('mouseover', () => {
                const rel = relRef.current
                if (!rel) return
                const company = row.company
                const connectedWhites = new Set(rel.custEdgesBySource[company] || [])

                redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                    m.setStyle(r === row ? HIGHLIGHT.red : DIMMED.red))
                orangeMarkersRef.current.forEach(({ marker: m, company: c }) =>
                    m.setStyle(c === company ? HIGHLIGHT.orange : DIMMED.orange))
                whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                    m.setStyle(connectedWhites.has(name) ? HIGHLIGHT.white : DIMMED.white))

                const orangeCoords = rel.orangeByName[company]
                if (orangeCoords) {
                    addEdge([lat, lng], orangeCoords, '#c51818')
                    connectedWhites.forEach(name => {
                        const c = customerCoords[name]
                        if (c) addEdge(orangeCoords, c, '#ffffff')
                    })
                }
            })

            marker.on('mouseout', clearHover)
            marker.on('click', () => {
                onSelectCountry(row.country)
            })
            marker.addTo(map)
            redMarkersRef.current.push({ marker, row })
        })

        // --- Orange platform nodes ---
        const seenCompanies = new Set()
        workerRows.forEach(row => {
            if (seenCompanies.has(row.company)) return
            seenCompanies.add(row.company)

            const lat = parseFloat(row.company_lat)
            const lng = parseFloat(row.company_long)
            const marker = L.circleMarker([lat, lng], {
                radius: 10, fillColor: '#f2572d', color: '#f2572d', weight: 1,
                ...DEFAULTS.orange
            })

            marker.on('mouseover', () => {
                const rel = relRef.current
                if (!rel) return
                const company = row.company
                const connectedWhites = new Set(rel.custEdgesBySource[company] || [])
                const orangeCoords = [lat, lng]

                redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                    m.setStyle(r.company === company ? HIGHLIGHT.red : DIMMED.red))
                orangeMarkersRef.current.forEach(({ marker: m, company: c }) =>
                    m.setStyle(c === company ? HIGHLIGHT.orange : DIMMED.orange))
                whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                    m.setStyle(connectedWhites.has(name) ? HIGHLIGHT.white : DIMMED.white))

                ;(rel.redByCompany[company] || []).forEach(r => {
                    addEdge([parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords, '#c51818')
                })
                connectedWhites.forEach(name => {
                    const c = customerCoords[name]
                    if (c) addEdge(orangeCoords, c, '#ffffff')
                })
            })

            marker.on('mouseout', clearHover)
            marker.on('click', () => {
                onSelectCompany(row.company)
            })
            marker.addTo(map)
            orangeMarkersRef.current.push({ marker, company: row.company, lat, lng })
        })

        // --- White customer nodes ---
        const companyLatLng = buildCompanyLatLng(countries)
        const mapNames = new Set(Object.keys(companyLatLng))
        const validEdges = customerEdges.filter(e => mapNames.has(e.source) && customerCoords[e.target])
        const renderedCustomers = new Set()

        validEdges.forEach(edge => {
            if (renderedCustomers.has(edge.target)) return
            renderedCustomers.add(edge.target)

            const coords = customerCoords[edge.target]
            const custName = edge.target
            const marker = L.circleMarker(coords, {
                radius: 8, fillColor: '#ffffff', color: '#ffffff', weight: 1,
                ...DEFAULTS.white
            })

            marker.on('mouseover', () => {
                const rel = relRef.current
                if (!rel) return
                const connectedOranges = new Set(rel.custEdgesByTarget[custName] || [])

                const connectedRedRows = new Set()
                connectedOranges.forEach(company => {
                    ;(rel.redByCompany[company] || []).forEach(r => connectedRedRows.add(r))
                })

                whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                    m.setStyle(name === custName ? HIGHLIGHT.white : DIMMED.white))
                orangeMarkersRef.current.forEach(({ marker: m, company }) =>
                    m.setStyle(connectedOranges.has(company) ? HIGHLIGHT.orange : DIMMED.orange))
                redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                    m.setStyle(connectedRedRows.has(r) ? HIGHLIGHT.red : DIMMED.red))

                connectedOranges.forEach(company => {
                    const orangeCoords = rel.orangeByName[company]
                    if (!orangeCoords) return
                    addEdge(orangeCoords, coords, '#ffffff')
                    ;(rel.redByCompany[company] || []).forEach(r => {
                        addEdge([parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords, '#c51818')
                    })
                })
            })

            marker.on('mouseout', clearHover)
            marker.on('click', () => {
                onSelectCustomer(custName)
            })
            marker.addTo(map)
            whiteMarkersRef.current.push({ marker, name: custName, coords })
        })
    }, [countries, customerEdges, customerCoords])

    // ── ViewMode permanent edges ─────────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        viewModeEdgesRef.current.forEach(l => map.removeLayer(l))
        viewModeEdgesRef.current = []

        if (!viewMode) return

        const rel = relRef.current
        if (!rel) return

        const showRed   = viewMode === 'platform-worker'          || viewMode === 'customer-platform-worker'
        const showWhite = viewMode === 'customer-platform'        || viewMode === 'customer-platform-worker'

        if (showRed) {
            Object.entries(rel.orangeByName).forEach(([company, orangeCoords]) => {
                ;(rel.redByCompany[company] || []).forEach(r => {
                    const line = L.polyline(
                        [[parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords],
                        { color: '#c51818', weight: 1, opacity: 0.4, smoothFactor: 1 }
                    ).addTo(map)
                    viewModeEdgesRef.current.push(line)
                })
            })
        }

        if (showWhite) {
            customerEdges.forEach(e => {
                const orangeCoords = rel.orangeByName[e.source]
                const whiteCoords  = customerCoords[e.target]
                if (!orangeCoords || !whiteCoords) return
                const line = L.polyline(
                    [orangeCoords, whiteCoords],
                    { color: '#ffffff', weight: 1, opacity: 0.25, smoothFactor: 1 }
                ).addTo(map)
                viewModeEdgesRef.current.push(line)
            })
        }
    }, [viewMode, countries, customerEdges, customerCoords])

    // Reset to world view on every story beat change (and on enter/exit)
    useEffect(() => {
        const map = mapRef.current
        if (!map) return
        setTimeout(() => {
            map.invalidateSize()
            map.flyTo([20, 0], 2, { duration: 1 })
        }, 50)
    }, [storyStep])

    // Beat auto-fly (beat 5 zooms into Silicon Valley)
    useEffect(() => {
        const map = mapRef.current
        if (!map || storyStep === null) return
        const beat = STORY_BEATS[storyStep]
        if (!beat.autoFly) return
        const timer = setTimeout(() => {
            map.flyTo(beat.autoFly.center, beat.autoFly.zoom, { duration: 2 })
        }, beat.autoFly.delayMs)
        return () => clearTimeout(timer)
    }, [storyStep])

    // Normal mode: zoom to selected country
    useEffect(() => {
        const map = mapRef.current
        if (!map || storyStep !== null) return
        if (!selectedCountry) {
            map.flyTo([20, 0], 2, { duration: 1 })
            return
        }
        const rows = countries.filter(row =>
            row.country === selectedCountry &&
            row.location_lat && row.location_long &&
            row.location_lat !== 'to be completed'
        )
        if (rows.length === 0) return
        const bounds = L.latLngBounds(rows.map(row => [parseFloat(row.location_lat), parseFloat(row.location_long)]))
        map.flyToBounds(bounds, { padding: [60, 60], duration: 1, maxZoom: 10 })
    }, [selectedCountry, countries])

    return (
        <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    )
}

export default MapView
