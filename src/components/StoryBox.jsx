import './StoryBox.css'

function StoryBox({ onEnterStory }) {
    return (
        <div className="story-box" onClick={onEnterStory} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onEnterStory()}>
            <p>Explore the data worker story →</p>
        </div>
    )
}

export default StoryBox
