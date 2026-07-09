import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import STORY_BEATS from '../data/storyBeats.js'

// Orange node coordinates, sourced directly from dal-platforms.csv (name → [lat, lng]).
function buildPlatformByName(platforms) {
    const result = {}
    platforms.forEach(p => {
        const lat = parseFloat(p.lat)
        const lng = parseFloat(p.lng)
        if (p.name && Number.isFinite(lat) && Number.isFinite(lng)) {
            result[p.name.trim()] = [lat, lng]
        }
    })
    return result
}

// Default opacities for each node type
const DEFAULTS = {
    red:    { fillOpacity: 0.5,  opacity: 0.7 },
    orange: { fillOpacity: 0.5, opacity: 1   },
    white:  { fillOpacity: 0.5,  opacity: 0.5 },
}
const HIGHLIGHT = {
    red:    { fillOpacity: 0.95, opacity: 1   },
    orange: { fillOpacity: 0.95, opacity: 1   },
    white:  { fillOpacity: 0.9,  opacity: 1   },
}
const DIMMED = {
    red:    { fillOpacity: 0.04, opacity: 0.04 },
    orange: { fillOpacity: 0.03, opacity: 0.04 },
    white:  { fillOpacity: 0.04, opacity: 0.04 },
}

// Shape-code the node types so they stay distinguishable for color-blind viewers:
// red workers = circle (L.circleMarker), orange platforms = square, white
// customers = triangle. Leaflet's circleMarker only draws circles, so the squares
// and triangles are rendered as SVG divIcon markers instead.
function shapeSvg(shape, color, { fillOpacity, opacity }) {
    const inner = shape === 'square'
        ? `<rect class="node-shape" x="2" y="2" width="16" height="16" fill="${color}" stroke="${color}" stroke-width="1" fill-opacity="${fillOpacity}" stroke-opacity="${opacity}"/>`
        : `<polygon class="node-shape" points="10,2.5 18.5,18 1.5,18" fill="${color}" stroke="${color}" stroke-width="1" stroke-linejoin="round" fill-opacity="${fillOpacity}" stroke-opacity="${opacity}"/>`
    return `<svg width="20" height="20" viewBox="0 0 20 20" style="display:block;overflow:visible;cursor:pointer">${inner}</svg>`
}

function makeShapeIcon(shape, color, style) {
    return L.divIcon({
        className: 'node-marker',     // custom class → drops the default leaflet-div-icon box
        html: shapeSvg(shape, color, style),
        iconSize: [20, 20],
        iconAnchor: [10, 10],         // center the shape on its coordinate, like a circleMarker
    })
}

// Apply a { fillOpacity, opacity } state to any node regardless of shape.
// circleMarkers use setStyle; shaped divIcon markers get their SVG element's
// fill/stroke opacity updated in place (no icon rebuild, so events survive).
function applyStyle(marker, style) {
    if (marker instanceof L.CircleMarker) {
        marker.setStyle(style)
        return
    }
    const el = marker.getElement()
    const shape = el && el.querySelector('.node-shape')
    if (shape) {
        shape.setAttribute('fill-opacity', style.fillOpacity)
        shape.setAttribute('stroke-opacity', style.opacity)
    }
}

// On mobile the screen is short, so a fixed zoom-2 world view gets cropped
// top/bottom. Fit the whole world into whatever space is available instead.
const WORLD_BOUNDS = L.latLngBounds([-58, -170], [78, 170])
function isMobileViewport() {
    return window.matchMedia('(max-width: 900px)').matches
}
function setWorldView(map) {
    if (isMobileViewport()) {
        map.fitBounds(WORLD_BOUNDS)
    } else {
        map.setView([20, 0], 2)
    }
}
// Respect users who've asked the OS to minimize motion: skip the animated pans
// (which can trigger vestibular discomfort) and jump straight to the destination.
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
function flyToWorldView(map, duration = 1) {
    if (prefersReducedMotion()) {
        setWorldView(map)
    } else if (isMobileViewport()) {
        map.flyToBounds(WORLD_BOUNDS, { duration })
    } else {
        map.flyTo([20, 0], 2, { duration })
    }
}

function MapView({
    countries,
    platforms = [],
    selectedPlatform = null,
    selectedCountry = null,
    selectedCustomer = null,
    customerEdges = [],
    customerCoords = {},
    showRedEdges = false,
    showWhiteEdges = false,
    storyStep = null,
    barFolded = false,
    onSelectPlatform = () => {},
    onSelectCountry = () => {},
    onSelectCustomer = () => {},
}) {
    const containerRef = useRef(null)
    const mapRef = useRef(null)

    // Story mode layers (rebuilt on story step change)
    const storyLayersRef = useRef([])

    // Normal mode marker collections (rebuilt when data changes)
    const redMarkersRef = useRef([])    // [{ marker, row }]
    const orangeMarkersRef = useRef([]) // [{ marker, platform, lat, lng }]
    const whiteMarkersRef = useRef([])  // [{ marker, name, coords }]

    // Dynamically added hover edges (cleared on mouseout)
    const hoverEdgesRef = useRef([])

    // Persistent edges drawn for the active selection
    const selectionEdgesRef = useRef([])

    // Permanent edges drawn for the active viewMode
    const viewModeEdgesRef = useRef([])

    // Pre-computed relationship maps
    const relRef = useRef(null)

    // Refs that keep prop values current inside stale closures
    const selectedPlatformRef = useRef(selectedPlatform)
    const selectedCustomerRef = useRef(selectedCustomer)
    const customerCoordsRef   = useRef(customerCoords)
    const selectedCountryRef  = useRef(selectedCountry)
    const storyStepRef        = useRef(storyStep)
    useEffect(() => { selectedPlatformRef.current = selectedPlatform }, [selectedPlatform])
    useEffect(() => { selectedCustomerRef.current = selectedCustomer }, [selectedCustomer])
    useEffect(() => { customerCoordsRef.current   = customerCoords   }, [customerCoords])
    useEffect(() => { selectedCountryRef.current  = selectedCountry  }, [selectedCountry])
    useEffect(() => { storyStepRef.current        = storyStep        }, [storyStep])

    // Ref holding the latest restoreSelectionStyles so clearHover (inside a stale closure) can call it
    const restoreSelectionStylesRef = useRef(null)

    // Applies highlight/dim marker styles matching the current selection (no edge drawing).
    // Uses only refs so the identity is stable and stale closures always get the latest version.
    const restoreSelectionStyles = useCallback(() => {
        const platform = selectedPlatformRef.current
        const customer = selectedCustomerRef.current
        const rel      = relRef.current

        if (!platform && !customer) {
            redMarkersRef.current.forEach(({ marker }) => applyStyle(marker, DEFAULTS.red))
            orangeMarkersRef.current.forEach(({ marker }) => applyStyle(marker, DEFAULTS.orange))
            whiteMarkersRef.current.forEach(({ marker }) => applyStyle(marker, DEFAULTS.white))
            return
        }

        if (platform) {
            const connectedWhites = new Set(rel?.custEdgesBySource[platform] || [])
            redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                applyStyle(m,r.company === platform ? HIGHLIGHT.red : DIMMED.red))
            orangeMarkersRef.current.forEach(({ marker: m, platform: p }) =>
                applyStyle(m,p === platform ? HIGHLIGHT.orange : DIMMED.orange))
            whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                applyStyle(m,connectedWhites.has(name) ? HIGHLIGHT.white : DIMMED.white))
        }

        if (customer) {
            const connectedOranges = new Set(rel?.custEdgesByTarget[customer] || [])
            const connectedRedRows = new Set()
            connectedOranges.forEach(p => {
                ;(rel?.redByPlatform[p] || []).forEach(r => connectedRedRows.add(r))
            })
            whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                applyStyle(m,name === customer ? HIGHLIGHT.white : DIMMED.white))
            orangeMarkersRef.current.forEach(({ marker: m, platform: p }) =>
                applyStyle(m,connectedOranges.has(p) ? HIGHLIGHT.orange : DIMMED.orange))
            redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                applyStyle(m,connectedRedRows.has(r) ? HIGHLIGHT.red : DIMMED.red))
        }
    }, [])

    // Keep the ref in sync so clearHover (inside a stale closure) always calls the latest version
    restoreSelectionStylesRef.current = restoreSelectionStyles

    // ── Selection highlight effect ───────────────────────────────────────
    // Mirrors the hover visual for the currently selected platform / customer.
    useEffect(() => {
        const map = mapRef.current

        // Clear any lingering hover edges and old selection edges
        hoverEdgesRef.current.forEach(l => map?.removeLayer(l))
        hoverEdgesRef.current = []
        selectionEdgesRef.current.forEach(l => map?.removeLayer(l))
        selectionEdgesRef.current = []

        // Apply marker styles
        restoreSelectionStyles()

        if (!map) return
        const rel = relRef.current
        if (!rel) return

        const addSelectionEdge = (from, to, color) => {
            // White customer-contract lines are dotted; red affiliation lines solid.
            const dashArray = color === '#ffffff' ? '2 5' : null
            const line = L.polyline([from, to], { color, weight: 1.5, opacity: 0.75, smoothFactor: 1, dashArray }).addTo(map)
            selectionEdgesRef.current.push(line)
        }

        if (selectedPlatform) {
            const orangeCoords    = rel.orangeByName[selectedPlatform]
            const connectedWhites = new Set(rel.custEdgesBySource[selectedPlatform] || [])
            if (orangeCoords) {
                ;(rel.redByPlatform[selectedPlatform] || []).forEach(r => {
                    addSelectionEdge([parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords, '#e5312e')
                })
                connectedWhites.forEach(name => {
                    const c = customerCoordsRef.current[name]
                    if (c) addSelectionEdge(orangeCoords, c, '#ffffff')
                })
            }
        }

        if (selectedCustomer) {
            const connectedOranges = new Set(rel.custEdgesByTarget[selectedCustomer] || [])
            const custCoords = customerCoordsRef.current[selectedCustomer]
            if (custCoords) {
                connectedOranges.forEach(p => {
                    const orangeCoords = rel.orangeByName[p]
                    if (!orangeCoords) return
                    addSelectionEdge(orangeCoords, custCoords, '#ffffff')
                    ;(rel.redByPlatform[p] || []).forEach(r => {
                        addSelectionEdge([parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords, '#e5312e')
                    })
                })
            }
        }
    }, [selectedPlatform, selectedCustomer, restoreSelectionStyles])

    useEffect(() => {
        // Zoom control moves to the bottom-left corner, out of the top-left
        // control stack's way (margins styled in index.css).
        const map = L.map(containerRef.current, { zoomControl: false })
        L.control.zoom({ position: 'bottomleft' }).addTo(map)
        mapRef.current = map
        setWorldView(map)

        // Drop the "Leaflet" prefix from the attribution bar. The tile-provider
        // credits themselves must stay (license requirement for Stadia/Stamen/OSM
        // tiles) but are restyled dark and compact in index.css.
        map.attributionControl.setPrefix(false)

        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map)

        // Re-fit the world view on rotation (e.g. the map mounts in portrait,
        // behind the MobileIntro gate, then the user rotates to landscape).
        // Skip while a story/selection is active so it doesn't yank the user
        // away from what they're looking at.
        const handleResize = () => {
            map.invalidateSize()
            if (storyStepRef.current !== null) return
            if (selectedCountryRef.current || selectedPlatformRef.current || selectedCustomerRef.current) return
            setWorldView(map)
        }
        window.addEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('orientationchange', handleResize)
            map.remove()
        }
    }, [])

    // Build relationship maps whenever data changes
    useEffect(() => {
        if (countries.length === 0 || customerEdges.length === 0) return

        const redByPlatform = {}  // platform → [rows]

        countries.forEach(row => {
            if (row.location_lat && row.location_lat !== 'to be completed' &&
                row.location_long && row.company) {
                if (!redByPlatform[row.company]) redByPlatform[row.company] = []
                redByPlatform[row.company].push(row)
            }
        })

        // Orange coordinates come straight from dal-platforms.csv, independent of worker rows
        const orangeByName = buildPlatformByName(platforms)   // platform → [lat, lng]

        const custEdgesBySource = {} // orange platform → [customer names]
        const custEdgesByTarget = {} // customer name   → [orange platforms]
        customerEdges.forEach(e => {
            if (!custEdgesBySource[e.source]) custEdgesBySource[e.source] = []
            custEdgesBySource[e.source].push(e.target)
            if (!custEdgesByTarget[e.target]) custEdgesByTarget[e.target] = []
            custEdgesByTarget[e.target].push(e.source)
        })

        relRef.current = { redByPlatform, orangeByName, custEdgesBySource, custEdgesByTarget }
    }, [countries, platforms, customerEdges])

    // ── Story mode layer rendering ───────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map || countries.length === 0 || storyStep === null) return

        storyLayersRef.current.forEach(l => map.removeLayer(l))
        storyLayersRef.current = []

        const { nodeFilter, highlightCountries, focusPlatform } = STORY_BEATS[storyStep]
        const shown = nodeFilter === 'all' ? ['red', 'orange', 'white'] : nodeFilter.split('+')
        const showRed    = shown.includes('red')
        const showOrange = shown.includes('orange')
        const showWhite  = shown.includes('white')

        // Focus-platform beats (Sama, Impact Enterprises): the platform's own
        // customers are the only white nodes highlighted, its workers the only reds.
        const focusWhites = focusPlatform
            ? new Set(customerEdges.filter(e => e.source === focusPlatform).map(e => e.target))
            : null

        const workerRows = countries.filter(row =>
            row.location_lat && row.location_long &&
            row.location_lat !== 'to be completed' &&
            row.company_lat && row.company_long
        )

        if (showRed) {
            workerRows.forEach(row => {
                const highlighted = focusPlatform
                    ? row.company === focusPlatform
                    : !highlightCountries || highlightCountries.includes(row.country)
                const marker = L.circleMarker(
                    [parseFloat(row.location_lat), parseFloat(row.location_long)],
                    { radius: 10, fillColor: '#e5312e', color: '#e5312e', weight: 1,
                      fillOpacity: highlighted ? 0.85 : 0.05, opacity: highlighted ? 0.9 : 0.05 }
                ).addTo(map)
                storyLayersRef.current.push(marker)
            })
        }

        const platformLatLng = buildPlatformByName(platforms)

        if (showOrange) {
            // Explicit orange beats (e.g. Silicon Valley) show platforms at full
            // strength; in 'all' overview beats they stay a quiet background layer.
            const baseStyle = nodeFilter === 'all'
                ? { fillOpacity: 0.2, opacity: 1 }
                : { fillOpacity: 0.5, opacity: 1 }
            Object.entries(platformLatLng).forEach(([name, coords]) => {
                const style = focusPlatform
                    ? (name === focusPlatform
                        ? { fillOpacity: 0.95, opacity: 1 }
                        : { fillOpacity: 0.03, opacity: 0.08 })
                    : baseStyle
                const marker = L.marker(coords, {
                    icon: makeShapeIcon('square', '#FF9500', style)
                }).addTo(map)
                storyLayersRef.current.push(marker)
            })
        }

        if (showWhite) {
            const mapNames = new Set(Object.keys(platformLatLng))
            const validEdges = customerEdges.filter(e => mapNames.has(e.source) && customerCoords[e.target])
            const rendered = new Set()
            validEdges.forEach(edge => {
                if (rendered.has(edge.target)) return
                rendered.add(edge.target)
                const style = focusPlatform
                    ? (focusWhites.has(edge.target)
                        ? { fillOpacity: 0.9, opacity: 1 }
                        : { fillOpacity: 0.04, opacity: 0.06 })
                    : { fillOpacity: 0.35, opacity: 0.6 }
                const marker = L.marker(customerCoords[edge.target], {
                    icon: makeShapeIcon('triangle', '#ffffff', style)
                }).addTo(map)
                storyLayersRef.current.push(marker)
            })
        }

        // Draw the focused platform's edges: solid red worker→platform lines,
        // dotted white platform→customer lines (matching normal-mode hover styling).
        if (focusPlatform) {
            const focusCoords = platformLatLng[focusPlatform]
            if (focusCoords) {
                workerRows.filter(r => r.company === focusPlatform).forEach(r => {
                    const line = L.polyline(
                        [[parseFloat(r.location_lat), parseFloat(r.location_long)], focusCoords],
                        { color: '#e5312e', weight: 1.5, opacity: 0.75, smoothFactor: 1 }
                    ).addTo(map)
                    storyLayersRef.current.push(line)
                })
                focusWhites.forEach(name => {
                    const c = customerCoords[name]
                    if (!c) return
                    const line = L.polyline(
                        [focusCoords, c],
                        { color: '#ffffff', weight: 1.5, opacity: 0.75, smoothFactor: 1, dashArray: '2 5' }
                    ).addTo(map)
                    storyLayersRef.current.push(line)
                })
            }
        }
    }, [storyStep, countries, platforms, customerEdges, customerCoords])

    // Clean up story layers when exiting story mode
    useEffect(() => {
        if (storyStep !== null) return
        const map = mapRef.current
        if (!map) return
        storyLayersRef.current.forEach(l => map.removeLayer(l))
        storyLayersRef.current = []
    }, [storyStep])

    // Hide normal-mode markers/edges when entering story; restore when exiting
    useEffect(() => {
        const map = mapRef.current
        if (!map) return
        const inStory = storyStep !== null

        redMarkersRef.current.forEach(({ marker }) =>
            inStory ? map.removeLayer(marker) : marker.addTo(map))
        orangeMarkersRef.current.forEach(({ marker }) =>
            inStory ? map.removeLayer(marker) : marker.addTo(map))
        whiteMarkersRef.current.forEach(({ marker }) =>
            inStory ? map.removeLayer(marker) : marker.addTo(map))
        viewModeEdgesRef.current.forEach(l =>
            inStory ? map.removeLayer(l) : l.addTo(map))
        selectionEdgesRef.current.forEach(l =>
            inStory ? map.removeLayer(l) : l.addTo(map))

        if (inStory) {
            hoverEdgesRef.current.forEach(l => map.removeLayer(l))
            hoverEdgesRef.current = []
        }
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
            restoreSelectionStylesRef.current()
        }

        const addEdge = (from, to, color) => {
            // White customer-contract lines are dotted; red affiliation lines solid.
            const dashArray = color === '#ffffff' ? '2 5' : null
            const line = L.polyline([from, to], { color, weight: 1.5, opacity: 0.75, smoothFactor: 1, dashArray }).addTo(map)
            hoverEdgesRef.current.push(line)
        }

        // --- Red nodes ---
        workerRows.forEach(row => {
            const lat = parseFloat(row.location_lat)
            const lng = parseFloat(row.location_long)
            const marker = L.circleMarker([lat, lng], {
                radius: 10, fillColor: '#e5312e', color: '#e5312e', weight: 1,
                ...DEFAULTS.red
            })

            marker.on('mouseover', () => {
                const rel = relRef.current
                if (!rel) return
                const platform = row.company
                const connectedWhites = new Set(rel.custEdgesBySource[platform] || [])

                redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                    applyStyle(m,r === row ? HIGHLIGHT.red : DIMMED.red))
                orangeMarkersRef.current.forEach(({ marker: m, platform: p }) =>
                    applyStyle(m,p === platform ? HIGHLIGHT.orange : DIMMED.orange))
                whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                    applyStyle(m,connectedWhites.has(name) ? HIGHLIGHT.white : DIMMED.white))

                const orangeCoords = rel.orangeByName[platform]
                if (orangeCoords) {
                    addEdge([lat, lng], orangeCoords, '#e5312e')
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

        // --- Orange platform nodes (sourced directly from dal-platforms.csv) ---
        const companyLatLng = buildPlatformByName(platforms)
        Object.entries(companyLatLng).forEach(([platform, [lat, lng]]) => {
            const marker = L.marker([lat, lng], {
                icon: makeShapeIcon('square', '#FF9500', DEFAULTS.orange)
            })

            marker.on('mouseover', () => {
                const rel = relRef.current
                if (!rel) return
                const connectedWhites = new Set(rel.custEdgesBySource[platform] || [])
                const orangeCoords = [lat, lng]

                redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                    applyStyle(m,r.company === platform ? HIGHLIGHT.red : DIMMED.red))
                orangeMarkersRef.current.forEach(({ marker: m, platform: p }) =>
                    applyStyle(m,p === platform ? HIGHLIGHT.orange : DIMMED.orange))
                whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                    applyStyle(m,connectedWhites.has(name) ? HIGHLIGHT.white : DIMMED.white))

                ;(rel.redByPlatform[platform] || []).forEach(r => {
                    addEdge([parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords, '#e5312e')
                })
                connectedWhites.forEach(name => {
                    const c = customerCoords[name]
                    if (c) addEdge(orangeCoords, c, '#ffffff')
                })
            })

            marker.on('mouseout', clearHover)
            marker.on('click', () => {
                onSelectPlatform(platform)
            })
            marker.addTo(map)
            orangeMarkersRef.current.push({ marker, platform, lat, lng })
        })

        // --- White customer nodes ---
        const mapNames = new Set(Object.keys(companyLatLng))
        const validEdges = customerEdges.filter(e => mapNames.has(e.source) && customerCoords[e.target])
        const renderedCustomers = new Set()

        validEdges.forEach(edge => {
            if (renderedCustomers.has(edge.target)) return
            renderedCustomers.add(edge.target)

            const coords = customerCoords[edge.target]
            const custName = edge.target
            const marker = L.marker(coords, {
                icon: makeShapeIcon('triangle', '#ffffff', DEFAULTS.white)
            })

            marker.on('mouseover', () => {
                const rel = relRef.current
                if (!rel) return
                const connectedOranges = new Set(rel.custEdgesByTarget[custName] || [])

                const connectedRedRows = new Set()
                connectedOranges.forEach(platform => {
                    ;(rel.redByPlatform[platform] || []).forEach(r => connectedRedRows.add(r))
                })

                whiteMarkersRef.current.forEach(({ marker: m, name }) =>
                    applyStyle(m,name === custName ? HIGHLIGHT.white : DIMMED.white))
                orangeMarkersRef.current.forEach(({ marker: m, platform }) =>
                    applyStyle(m,connectedOranges.has(platform) ? HIGHLIGHT.orange : DIMMED.orange))
                redMarkersRef.current.forEach(({ marker: m, row: r }) =>
                    applyStyle(m,connectedRedRows.has(r) ? HIGHLIGHT.red : DIMMED.red))

                connectedOranges.forEach(platform => {
                    const orangeCoords = rel.orangeByName[platform]
                    if (!orangeCoords) return
                    addEdge(orangeCoords, coords, '#ffffff')
                    ;(rel.redByPlatform[platform] || []).forEach(r => {
                        addEdge([parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords, '#e5312e')
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
    }, [countries, platforms, customerEdges, customerCoords])

    // ── Permanent edge layers (toggled from the legend's line rows) ──────
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        viewModeEdgesRef.current.forEach(l => map.removeLayer(l))
        viewModeEdgesRef.current = []

        if (!showRedEdges && !showWhiteEdges) return

        const rel = relRef.current
        if (!rel) return

        if (showRedEdges) {
            Object.entries(rel.orangeByName).forEach(([platform, orangeCoords]) => {
                ;(rel.redByPlatform[platform] || []).forEach(r => {
                    const line = L.polyline(
                        [[parseFloat(r.location_lat), parseFloat(r.location_long)], orangeCoords],
                        { color: '#e5312e', weight: 1, opacity: 0.4, smoothFactor: 1 }
                    ).addTo(map)
                    viewModeEdgesRef.current.push(line)
                })
            })
        }

        if (showWhiteEdges) {
            customerEdges.forEach(e => {
                const orangeCoords = rel.orangeByName[e.source]
                const whiteCoords  = customerCoords[e.target]
                if (!orangeCoords || !whiteCoords) return
                const line = L.polyline(
                    [orangeCoords, whiteCoords],
                    { color: '#ffffff', weight: 1, opacity: 0.25, smoothFactor: 1, dashArray: '2 5' }
                ).addTo(map)
                viewModeEdgesRef.current.push(line)
            })
        }
    }, [showRedEdges, showWhiteEdges, countries, customerEdges, customerCoords])

    // Reset to world view on every story beat change (and on enter/exit)
    useEffect(() => {
        const map = mapRef.current
        if (!map) return
        const timer = setTimeout(() => {
            map.invalidateSize()
            if (map.getSize().x === 0) return
            flyToWorldView(map, 1)
        }, 50)
        return () => clearTimeout(timer)
    }, [storyStep])

    // Folding/unfolding the bottom bar changes the map's height: once the
    // 0.35s padding transition settles, remeasure and recenter the world view
    // (unless the user is mid-story or has an active selection to preserve).
    const prevFoldedRef = useRef(barFolded)
    useEffect(() => {
        if (prevFoldedRef.current === barFolded) return // skip mount
        prevFoldedRef.current = barFolded
        const map = mapRef.current
        if (!map) return
        const timer = setTimeout(() => {
            map.invalidateSize()
            if (map.getSize().x === 0) return
            if (storyStepRef.current !== null) return
            if (selectedCountryRef.current || selectedPlatformRef.current || selectedCustomerRef.current) return
            flyToWorldView(map, 0.8)
        }, 380)
        return () => clearTimeout(timer)
    }, [barFolded])

    // Beat auto-fly (beats 4, 5, and 7 zoom into South/Southeast Asia,
    // Silicon Valley, and Kenya/Uganda respectively)
    useEffect(() => {
        const map = mapRef.current
        if (!map || storyStep === null) return
        const beat = STORY_BEATS[storyStep]
        if (!beat.autoFly) return
        const timer = setTimeout(() => {
            if (prefersReducedMotion()) {
                map.setView(beat.autoFly.center, beat.autoFly.zoom, { animate: false })
            } else {
                map.flyTo(beat.autoFly.center, beat.autoFly.zoom, { duration: 2 })
            }
        }, beat.autoFly.delayMs)
        return () => clearTimeout(timer)
    }, [storyStep])

    // Normal mode: zoom to selected country
    useEffect(() => {
        const map = mapRef.current
        if (!map || storyStep !== null) return
        // Guard against flying before the container has a measured size (StrictMode
        // remount race), which makes Leaflet project to (NaN, NaN) and throw.
        if (map.getSize().x === 0) return
        if (!selectedCountry) {
            flyToWorldView(map, 1)
            return
        }
        const rows = countries.filter(row =>
            row.country === selectedCountry &&
            row.location_lat && row.location_long &&
            row.location_lat !== 'to be completed'
        )
        if (rows.length === 0) return
        const bounds = L.latLngBounds(rows.map(row => [parseFloat(row.location_lat), parseFloat(row.location_long)]))
        if (prefersReducedMotion()) {
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10, animate: false })
        } else {
            map.flyToBounds(bounds, { padding: [60, 60], duration: 1, maxZoom: 10 })
        }
    }, [selectedCountry, countries])

    return (
        <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    )
}

export default MapView
