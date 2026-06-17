import STORY_BEATS from '../data/storyBeats.js'
import './StoryPanel.css'

function StoryPanel({ step, onStep, onClose }) {
    const beat = STORY_BEATS[step]
    const isFirst = step === 0
    const isLast = step === STORY_BEATS.length - 1

    return (
        <div className="story-panel">
            <button className="story-panel-close" onClick={onClose}>×</button>

            <div className="story-panel-body">
                <p className="story-panel-text">{beat.text}</p>
                {beat.citation && (
                    <p className="story-panel-citation">{beat.citation}</p>
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
