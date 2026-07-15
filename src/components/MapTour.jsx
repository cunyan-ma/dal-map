import { useEffect, useRef, useState } from 'react'
import './MapTour.css'

// Guided "how to navigate the map" walkthrough. Each step circles one or more
// existing UI elements (found by selector) in white and shows a short text
// card with a Next button. Rings live in a full-screen SVG re-measured every
// animation frame, so they track map pans, the bar fold, and window resizes.

// targets: each entry becomes one feathered highlight around the union of its
//   selectors. inset: true draws it just inside the element instead (used for
//   the full map, whose wrap-around ellipse would leave the screen). noArrow
//   skips the text-to-target pointer for that highlight.
// card: which highlight the text hangs off (index into targets), where, and
//   how far away (dist, px) — far enough that the pointer arrow reads in full.
//   place 'corner' pins the text to the bottom-right of the viewport instead.
// arrowTo: optional selector the text points an extra arrow at (the pop-up).
const STEPS = [
    {
        targets: [{ selectors: ['.bottombar-tab'] }],
        text: 'Fold the bottom bar for a cleaner view.',
        card: { anchor: 0, place: 'above', dist: 130 },
    },
    {
        targets: [
            { selectors: ['.map-wrap'], inset: true, noArrow: true },
            { selectors: ['.legend'] },
        ],
        text: 'Examine the geographic distribution of the supply chain across the map. Who demands data labeling services, who contracts those services, and what labor supplies those services?',
        card: { anchor: 0, place: 'corner' },
    },
    {
        targets: [
            { selectors: ['[data-platform="Sama"]'] },
            { selectors: ['.search-dock'] },
        ],
        arrowTo: '.platform-info',
        // Extra un-darkened (but un-ringed) areas: the pop-up the arrow points at
        cutouts: ['.platform-info'],
        text: 'Hover on a node, or search by worker location / platform / customer, to learn about its relationships with other nodes. Read relevant reporting about the node in the pop-up window.',
        card: { anchor: 1, place: 'below', dist: 60 },
    },
    {
        targets: [{ selectors: ['.story-box'] }],
        text: 'Read about the relationships between data workers, their platforms, and the socioeconomic conditions that drive such connections.',
        card: { anchor: 0, place: 'right', dist: 150 },
    },
    {
        targets: [{ selectors: ['.navbar-links a[href$="/database"]'] }],
        text: 'Download the original database here.',
        card: { anchor: 0, place: 'below', dist: 130 },
    },
    {
        targets: [{ selectors: ['.navbar-links a[href$="/about"]', '.navbar-links a[href$="/methodology"]'] }],
        text: 'Read more about the project here.',
        card: { anchor: 0, place: 'below', dist: 130 },
    },
]

function unionRect(rects) {
    const left   = Math.min(...rects.map(r => r.left))
    const top    = Math.min(...rects.map(r => r.top))
    const right  = Math.max(...rects.map(r => r.right))
    const bottom = Math.max(...rects.map(r => r.bottom))
    return { left, top, right, bottom, width: right - left, height: bottom - top }
}

function ringFor(target) {
    const rects = target.selectors
        .map(s => document.querySelector(s))
        .filter(Boolean)
        .map(el => el.getBoundingClientRect())
        .filter(r => r.width > 0 || r.height > 0)
    if (rects.length === 0) return null
    const r = unionRect(rects)
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    if (target.inset) {
        return {
            cx: Math.round(cx), cy: Math.round(cy),
            rx: Math.round(Math.max(r.width / 2 - 28, 40)),
            ry: Math.round(Math.max(r.height / 2 - 22, 40)),
        }
    }
    // Wrap-around ellipse: big enough to clear the rect's corners, with a
    // minimum padding so tiny targets (a node, the fold tab) still get a ring.
    return {
        cx: Math.round(cx), cy: Math.round(cy),
        rx: Math.round(Math.max(r.width * 0.72, r.width / 2 + 18)),
        ry: Math.round(Math.max(r.height * 0.72, r.height / 2 + 14)),
    }
}

function placeCard(ring, place, cw, ch, dist = 120) {
    let x, y
    if (place === 'corner') {
        // Pinned to the bottom-right of the viewport, out of the map's way
        x = window.innerWidth - cw - 48
        y = window.innerHeight - ch - 56
    }
    else if (place === 'above') { x = ring.cx - cw / 2;               y = ring.cy - ring.ry - dist - ch }
    else if (place === 'below') { x = ring.cx - cw / 2;               y = ring.cy + ring.ry + dist }
    else if (place === 'right') { x = ring.cx + ring.rx + dist;       y = ring.cy - ch / 2 }
    else if (place === 'left')  { x = ring.cx - ring.rx - dist - cw;  y = ring.cy - ch / 2 }
    else                        { x = ring.cx - cw / 2;               y = ring.cy - ch / 2 } // center
    x = Math.max(8, Math.min(x, window.innerWidth - cw - 8))
    y = Math.max(8, Math.min(y, window.innerHeight - ch - 8))
    return { x: Math.round(x), y: Math.round(y) }
}

function MapTour({ step = 0, onStep = () => {}, onClose = () => {} }) {
    const [geo, setGeo] = useState({ rings: [], cutouts: [], card: null, arrows: [] })
    const cardRef = useRef(null)
    const nextRef = useRef(null)

    const conf = STEPS[step]
    const isLast = step === STEPS.length - 1

    // Re-measure the circled elements every frame while the tour is open.
    useEffect(() => {
        let raf
        const tick = () => {
            const pairs = conf.targets
                .map(target => ({ target, ring: ringFor(target) }))
                .filter(p => p.ring)
            const rings = pairs.map(p => p.ring)

            const cutouts = (conf.cutouts || [])
                .map(sel => {
                    const el = document.querySelector(sel)
                    if (!el) return null
                    const r = el.getBoundingClientRect()
                    if (!r.width && !r.height) return null
                    return {
                        x: Math.round(r.left - 6), y: Math.round(r.top - 6),
                        w: Math.round(r.width + 12), h: Math.round(r.height + 12),
                    }
                })
                .filter(Boolean)

            let card = null
            const anchor = rings[conf.card.anchor] || rings[0]
            if (anchor) {
                const el = cardRef.current
                card = placeCard(anchor, conf.card.place, el?.offsetWidth || 300, el?.offsetHeight || 140, conf.card.dist)
            }

            // One pointer arrow from the floating text to each highlighted
            // area: rings the text doesn't already sit inside, plus any
            // arrowTo element (the pop-up window on the node step).
            const arrows = []
            if (card) {
                const cw = cardRef.current?.offsetWidth || 300
                const ch = cardRef.current?.offsetHeight || 120
                const ccx = card.x + cw / 2
                const ccy = card.y + ch / 2

                // start on the text block's edge, end just outside the target
                const addArrow = (ex, ey) => {
                    let ux = ex - ccx
                    let uy = ey - ccy
                    const len = Math.hypot(ux, uy)
                    if (len < 40) return
                    ux /= len
                    uy /= len
                    const tEdge = Math.min(
                        (cw / 2 + 10) / (Math.abs(ux) || 1e-6),
                        (ch / 2 + 10) / (Math.abs(uy) || 1e-6),
                    )
                    if (tEdge >= len) return
                    arrows.push({
                        x1: Math.round(ccx + ux * tEdge),
                        y1: Math.round(ccy + uy * tEdge),
                        x2: Math.round(ex),
                        y2: Math.round(ey),
                    })
                }

                pairs.forEach(({ target, ring: r }) => {
                    if (target.noArrow) return
                    // skip rings the text floats inside (e.g. the full-map one)
                    if (((ccx - r.cx) / r.rx) ** 2 + ((ccy - r.cy) / r.ry) ** 2 <= 1) return
                    const dx = ccx - r.cx
                    const dy = ccy - r.cy
                    const t = 1 / Math.sqrt((dx / r.rx) ** 2 + (dy / r.ry) ** 2)
                    const gap = 8 / Math.hypot(dx, dy)
                    addArrow(r.cx + dx * (t + gap), r.cy + dy * (t + gap))
                })

                if (conf.arrowTo) {
                    const el = document.querySelector(conf.arrowTo)
                    if (el) {
                        const r = el.getBoundingClientRect()
                        const rcx = r.left + r.width / 2
                        const rcy = r.top + r.height / 2
                        let ux = ccx - rcx
                        let uy = ccy - rcy
                        const len = Math.hypot(ux, uy) || 1
                        ux /= len
                        uy /= len
                        const tEdge = Math.min(
                            (r.width / 2 + 8) / (Math.abs(ux) || 1e-6),
                            (r.height / 2 + 8) / (Math.abs(uy) || 1e-6),
                        )
                        addArrow(rcx + ux * tEdge, rcy + uy * tEdge)
                    }
                }
            }

            setGeo(prev => {
                const next = { rings, cutouts, card, arrows }
                return JSON.stringify(prev) === JSON.stringify(next) ? prev : next
            })
        }
        const loop = () => {
            tick()
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        // rAF stalls in hidden/throttled tabs; a slow interval keeps the
        // geometry fresh there (setGeo dedupes, so this is cheap).
        const interval = setInterval(tick, 250)
        return () => {
            cancelAnimationFrame(raf)
            clearInterval(interval)
        }
    }, [conf])

    // Keep the Next button focused (Enter advances) and close on Escape.
    useEffect(() => { nextRef.current?.focus() }, [step])
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    // Gentle quadratic arc: control point offset perpendicular to the line,
    // scaled with its length so short arrows stay nearly straight.
    const arrowPath = (a) => {
        const dx = a.x2 - a.x1
        const dy = a.y2 - a.y1
        const len = Math.hypot(dx, dy) || 1
        const bend = Math.min(50, len * 0.22)
        let px = -dy / len
        let py = dx / len
        if (py > 0) { px = -px; py = -py } // always bow upward
        const mx = (a.x1 + a.x2) / 2 + px * bend
        const my = (a.y1 + a.y2) / 2 + py * bend
        return `M ${a.x1} ${a.y1} Q ${mx} ${my} ${a.x2} ${a.y2}`
    }

    return (
        <>
            <svg className="map-tour-svg" aria-hidden="true">
                <defs>
                    <marker id="map-tour-arrowhead" markerWidth="10" markerHeight="10"
                        refX="7" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                    </marker>
                    {/* Feathers the mask holes so the scrim fades in around the
                        highlighted areas instead of ending at a hard ellipse. */}
                    <filter id="map-tour-feather" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="18" />
                    </filter>
                    {/* The scrim shows where the mask is white; the highlight
                        shapes are black, i.e. punched out of it. They're grown
                        slightly so the blur doesn't dim the target itself. */}
                    <mask id="map-tour-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <g filter="url(#map-tour-feather)">
                            {geo.rings.map((r, i) => (
                                <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx + 16} ry={r.ry + 16} fill="black" />
                            ))}
                            {geo.cutouts.map((r, i) => (
                                <rect key={i} x={r.x - 10} y={r.y - 10} width={r.w + 20} height={r.h + 20} rx="10" fill="black" />
                            ))}
                        </g>
                    </mask>
                </defs>
                <rect
                    className="map-tour-scrim"
                    x="0" y="0" width="100%" height="100%"
                    mask="url(#map-tour-mask)"
                />
                {geo.arrows.map((a, i) => (
                    <path key={i} className="map-tour-arrow" d={arrowPath(a)} markerEnd="url(#map-tour-arrowhead)" />
                ))}
            </svg>

            <div
                className="map-tour-card"
                ref={cardRef}
                role="dialog"
                aria-label="How to navigate the map"
                style={geo.card
                    ? { left: geo.card.x, top: geo.card.y, opacity: 1 }
                    : { left: 0, top: 0, opacity: 0 }}
            >
                <button className="map-tour-close" onClick={onClose} aria-label="Close tour">×</button>
                <p className="map-tour-text">{conf.text}</p>
                <div className="map-tour-footer">
                    <span className="map-tour-count">({step + 1}/{STEPS.length})</span>
                    <button
                        className="map-tour-next"
                        ref={nextRef}
                        onClick={() => (isLast ? onClose() : onStep(step + 1))}
                        aria-label={isLast ? 'Finish tour' : 'Next step'}
                    >
                        →
                    </button>
                </div>
            </div>
        </>
    )
}

export default MapTour
