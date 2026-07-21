import './PlatformInfo.css'
import PLATFORM_STORIES from '../data/platformStories'

function PlatformInfo({ platform, countries = [], onClose, lowered = false }) {
    const rows = countries.filter(r => r.company === platform)
    const locations = [...new Set(rows.map(r => r.location).filter(Boolean))]
    const countryNames = [...new Set(rows.map(r => r.country).filter(Boolean))]
    const stories = PLATFORM_STORIES[platform] ?? []

    return (
        <div className={`platform-info ${lowered ? 'lowered' : ''}`}>
            <div className="platform-info-header">
                <span>{platform}</span>
                <button className="platform-info-close" onClick={onClose}>×</button>
            </div>

            <div className="platform-info-description">
                <span>{platform} has {locations.length} delivery centeres across
                    {countryNames.length} countries. These are:
                </span>
            </div>

             <ul className="platform-info-list">
                {locations.map(loc => {
                    const row = rows.find(r => r.location === loc)
                    return (
                        <li key={loc}>
                            {loc}{row?.country ? `, ${row.country}` : ''}
                        </li>
                    )
                })}
            </ul>

            {stories.length > 0 && (
                <>
                    <div className="platform-info-description">
                        <span>Learn more about {platform} here:</span>
                    </div>
                    <ul className="platform-info-list platform-info-stories">
                        {stories.map(story => (
                            <li key={story.url}>
                                <a href={story.url} target="_blank" rel="noopener noreferrer">
                                    {story.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* <div className="platform-info-stat">
                <span className="platform-info-label">Delivery centers</span>
                <span className="platform-info-value">{locations.length}</span>
            </div>

            <ul className="platform-info-list">
                {locations.map(loc => {
                    const row = rows.find(r => r.location === loc)
                    return (
                        <li key={loc}>
                            {loc}{row?.country ? `, ${row.country}` : ''}
                        </li>
                    )
                })}
            </ul>

            {countryNames.length > 0 && (
                <div className="platform-info-stat">
                    <span className="platform-info-label">Countries</span>
                    <span className="platform-info-value">{countryNames.length}</span>
                </div>
            )} */}
        </div>
    )
}

export default PlatformInfo
