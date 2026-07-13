import './StoryBox.css'

function StoryBox({ onEnterStory }) {
    return (
        <div className="story-box" onClick={onEnterStory} role="button" tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onEnterStory()
                }
            }}>
            <p>Explore the data worker story </p>
        </div>
    )
}

export default StoryBox
