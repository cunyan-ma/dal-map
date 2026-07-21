import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import './BottomBar.css'

function BottomBar({ folded = false, onToggleFold = () => {}, onStartTour = () => {} }) {
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

    return (
        <div className={`bottombar ${folded ? 'bottombar-folded' : ''}`}>
            {/* Fold tab: rides the bar's top edge, stays peeking when folded */}
            <button
                className="bottombar-tab"
                onClick={onToggleFold}
                aria-expanded={!folded}
                aria-label={folded ? 'Show info bar' : 'Hide info bar'}
            >
                <svg viewBox="0 0 12 6" width="12" height="6" aria-hidden="true">
                    <polyline points="1,1 6,5 11,1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </button>

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

                <button className="bottombar-howto" onClick={onStartTour}>
                    <span className="bottombar-howto-q" aria-hidden="true">?</span>
                    How to navigate the map
                </button>
            </div>
        </div>
    )
}

export default BottomBar
