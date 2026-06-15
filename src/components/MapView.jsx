import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'   // ← required, or tiles render broken

function MapView({ countries, selectedCompany = null, selectedCountry = null }) {
    // useRef gives us a stable reference to the DOM div across renders
    // without triggering re-renders the way useState would
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const layersRef = useRef([])   // track every marker so we can wipe on re-render


    useEffect(() => {
        // useEffect runs *after* React has put the div into the DOM.
        // This is the only safe place to call L.map() — Leaflet needs
        // a real DOM node, which doesn't exist yet during render.

        const map = L.map(containerRef.current).setView([20, 0], 2)
        mapRef.current = map

        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map)

        // Cleanup: when the component unmounts, destroy the map.
        // Without this, navigating away and back creates a second Leaflet
        // instance on the same div and throws "Map already initialized".
        return () => {
            map.remove()
        }
    }, []) // empty array = run once on mount, cleanup on unmount

    useEffect(() => {
        const map = mapRef.current
        if (!map || countries.length === 0) return

        layersRef.current.forEach(l => map.removeLayer(l))
        layersRef.current = []

        const workerRows = countries.filter(
            row =>
                row.location_lat &&
                row.location_long &&
                row.location_lat !== 'to be completed' &&
                row.company_lat &&
                row.company_long
        )

        workerRows.forEach(row => {
            const location_lat = parseFloat(row.location_lat)
            const location_long = parseFloat(row.location_long)

            const company_lat = parseFloat(row.company_lat)
            const company_long = parseFloat(row.company_long)

            const isSelected = row.company === selectedCompany
            const isDimmed = selectedCompany && !isSelected

            const marker = L.circleMarker([location_lat, location_long], {
                radius: 10,
                fillOpacity: isSelected ? 0.9 : (isDimmed ? 0.03 : 0.7),
                fillColor: '#c51818',
                color: '#c51818',
                weight: 1,
                opacity: isSelected ? 1 : (isDimmed ? 0.03 : 0.7),
            })
                .bindPopup(`<strong>${row.company}</strong><br/>${row.location}, ${row.country}`)

            const arrow = L.polyline([[company_lat, company_long], [location_lat, location_long]], {
                color: '#c51818',
                weight: isSelected ? 2 : 1,
                opacity: isSelected ? 0.9 : (isDimmed ? 0.03 : 0.7),
                smoothFactor: 1.0
            })

            marker.addTo(map)
            arrow.addTo(map)
            layersRef.current.push(marker, arrow)
        })

        //

        const allCompanies = new Set()

        countries
            .filter(row => {
                if (!row.company_lat || !row.company_long) return false
                if (allCompanies.has(row)) return false
                allCompanies.add(row)
                return true
            })

        allCompanies.forEach(row => {
            const isSelected = row.company === selectedCompany
            const isDimmed = selectedCompany && !isSelected

            const marker = L.circleMarker([
                parseFloat(row.company_lat),
                parseFloat(row.company_long),
            ], {
                radius: 10,
                fillOpacity: isSelected ? 0.8 : (isDimmed ? 0.02 : 0.1),
                fillColor: '#f2572d',
                color: '#f2572d',
                weight: 1,
                opacity: isSelected ? 1 : (isDimmed ? 0.03 : 1),
            })
                .bindPopup(`<strong>${row.company}</strong><br/>${row.location}, ${row.country}`)

            marker.addTo(map)
            layersRef.current.push(marker)
        })
    }, [countries, selectedCompany]) // ← "re-run whenever countries or selection changes"

    // Whenever the selected company changes, reset the view back to the
    // full world view so the dimmed/highlighted layers are all visible.
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        map.flyTo([20, 0], 2, { duration: 1 })
    }, [selectedCompany])

    // Whenever the selected country changes, zoom/pan so every node located
    // in that country is visible — or reset to the world view if cleared.
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        if (!selectedCountry) {
            map.flyTo([20, 0], 2, { duration: 1 })
            return
        }

        const rows = countries.filter(
            row =>
                row.country === selectedCountry &&
                row.location_lat &&
                row.location_long &&
                row.location_lat !== 'to be completed'
        )
        if (rows.length === 0) return

        const bounds = L.latLngBounds(
            rows.map(row => [parseFloat(row.location_lat), parseFloat(row.location_long)])
        )

        map.flyToBounds(bounds, { padding: [60, 60], duration: 1, maxZoom: 10 })
    }, [selectedCountry, countries])

    return (
        <div
            ref={containerRef}          // ← this is what L.map() attaches to
            style={{ height: '100%', width: '100%' }}
        />
    )
}

export default MapView
