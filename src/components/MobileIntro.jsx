import { useMediaQuery, useIsMobile } from '../hooks/useMediaQuery'
import './MobileIntro.css'

// Full-screen gate shown only on a small/touch screen held in portrait. It
// carries the title + blurb (the desktop bottom bar is hidden on mobile) and
// asks the user to turn the device sideways. The instant the screen goes
// landscape it unmounts, dropping the user straight into the map — no button.
function MobileIntro() {
    const isMobile = useIsMobile()
    const isPortrait = useMediaQuery('(orientation: portrait)')

    // Desktop: never shown. Mobile landscape: unmount → straight into the map.
    if (!isMobile || !isPortrait) return null

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

                <div className="mobile-intro-rotate">
                    {/* A portrait phone that tips 90° into landscape, with a
                        curved arrow tracing the same turn. */}
                    <svg className="mobile-intro-rotate-icon" viewBox="0 0 120 120" aria-hidden="true">
                        <path className="mobile-intro-turn-arc" d="M32 34 A40 40 0 0 1 88 34" fill="none" />
                        <path className="mobile-intro-turn-head" d="M88 34 l-10 -2 M88 34 l2 10" fill="none" />
                        <g className="mobile-intro-phone">
                            <rect className="mobile-intro-phone-body" x="49" y="34" width="22" height="52" rx="4" />
                            <line className="mobile-intro-phone-home" x1="56" y1="81" x2="64" y2="81" />
                        </g>
                    </svg>
                    <span>Rotate your device sideways to explore the map</span>
                </div>
            </div>
        </div>
    )
}

export default MobileIntro
