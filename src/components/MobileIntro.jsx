import { useEffect, useState } from 'react'
import './MobileIntro.css'

// Small matchMedia hook that stays in sync as the viewport / orientation changes.
function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
    useEffect(() => {
        const mql = window.matchMedia(query)
        const handler = e => setMatches(e.matches)
        setMatches(mql.matches)
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [query])
    return matches
}

// Full-screen gate shown only on small/touch screens.
//  - portrait  → show the title + blurb and ask the user to rotate sideways
//  - landscape → show the title + blurb and a button to enter the map
// On desktop it renders nothing, so the map behaves exactly as before.
function MobileIntro() {
    const isMobile = useMediaQuery('(max-width: 900px)')
    const isPortrait = useMediaQuery('(orientation: portrait)')
    const [entered, setEntered] = useState(false)

    if (!isMobile) return null
    if (entered && !isPortrait) return null

    return (
        <div className="mobile-intro">
            <div className="mobile-intro-content">
                <h1 className="mobile-intro-title">
                    WHERE ARE THE<br />
                    <span className="mobile-intro-highlight">DATA WORKERS</span><br />
                    BEHIND AI?
                </h1>

                <div className="mobile-intro-blurb">
                    <p>
                        Behind AI is an enormous, deliberately hidden web of human
                        labor. Data workers are paid as little as $2 an hour to render
                        data legible to machines&mdash;recruited, often, from places
                        where the poor economic conditions made such wage appealing.
                    </p>
                    <p>
                        Mapped here are the delivery centers where this labor happens,
                        the platforms that employ it, and the customers it serves. Trace
                        the lines between them to explore the concentration of power
                        behind AI.
                    </p>
                </div>

                <p className="mobile-intro-disclaimer">
                    Some features are limited on mobile. For the full experience,
                    please view this site on a laptop or larger screen.
                </p>

                {isPortrait ? (
                    <div className="mobile-intro-rotate">
                        <svg className="mobile-intro-phone" viewBox="0 0 120 120" aria-hidden="true">
                            <rect className="mobile-intro-phone-body" x="44" y="20" width="32" height="58" rx="6" />
                            <line className="mobile-intro-phone-speaker" x1="55" y1="27" x2="65" y2="27" />
                            <circle className="mobile-intro-phone-home" cx="60" cy="71" r="2.4" />
                            <path className="mobile-intro-arrow" d="M88 64 a30 30 0 0 1 -28 26" fill="none" />
                            <path className="mobile-intro-arrow-head" d="M54 88 l6 4 l4 -6" fill="none" />
                        </svg>
                        <p>Rotate your device sideways to explore the map</p>
                    </div>
                ) : (
                    <button className="mobile-intro-enter" onClick={() => setEntered(true)}>
                        Enter the map &rarr;
                    </button>
                )}
            </div>
        </div>
    )
}

export default MobileIntro
