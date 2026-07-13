import STORY_BEATS from '../data/storyBeats.js'
import './StoryPanel.css'

// Replace [n] markers in the beat text with superscript links into the beat's
// citations array (1-indexed). Text without markers passes through unchanged;
// a marker with no matching citation is left as literal text.
function renderWithCitations(text, citations) {
    return text.split(/\[(\d+)\]/g).map((part, i) => {
        if (i % 2 === 0) return part
        const url = citations[Number(part) - 1]
        if (!url) return `[${part}]`
        return (
            <sup key={i}>
                <a className="story-panel-cite-ref" href={url} target="_blank" rel="noreferrer">
                    [{part}]
                </a>
            </sup>
        )
    })
}

// Show "time.com" instead of the full URL in the source list
function citationLabel(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

function StoryPanel({ step, onStep, onClose }) {
    const beat = STORY_BEATS[step]
    const citations = beat.citations || []
    const isFirst = step === 0
    const isLast = step === STORY_BEATS.length - 1

    return (
        <div className="story-panel">
            <button className="story-panel-close" onClick={onClose}>×</button>

            <div className="story-panel-body">
                <p className="story-panel-text">
                    {renderWithCitations(beat.text, citations)}
                </p>

                {citations.length > 0 && (
                    <ol className="story-panel-citations">
                        {citations.map((url, i) => (
                            <li key={i}>
                                <a href={url} target="_blank" rel="noreferrer">
                                    {citationLabel(url)}
                                </a>
                            </li>
                        ))}
                    </ol>
                )}
            </div>

            <div className="story-panel-footer">
                <button
                    className="story-panel-nav"
                    onClick={() => onStep(step - 1)}
                    disabled={isFirst}
                >
                    ← Back
                </button>
                <span className="story-panel-progress">
                    {step + 1} / {STORY_BEATS.length}
                </span>
                <button
                    className="story-panel-nav"
                    onClick={() => onStep(step + 1)}
                    disabled={isLast}
                >
                    Next →
                </button>
            </div>
        </div>
    )
}

export default StoryPanel
