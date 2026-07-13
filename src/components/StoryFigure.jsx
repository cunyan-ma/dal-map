import './StoryFigure.css'

// Floating photo shown over the map during story mode. Each beat places its
// image on a part of the map free of that beat's nodes via image.position
// (CSS offsets relative to the map area) — see the schema notes in storyBeats.js.
function StoryFigure({ image }) {
    if (!image) return null
    const { src, alt, caption, position, width, rotate } = image
    const style = {
        width: `${width || 240}px`,
        '--figure-rotate': `${rotate ?? -2}deg`,
        ...(position || { bottom: '10%', right: '6%' }),
    }
    return (
        <figure className="story-figure" style={style}>
            <img src={import.meta.env.BASE_URL + src} alt={alt || ''} />
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}

export default StoryFigure
