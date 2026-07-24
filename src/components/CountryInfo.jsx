import './CountryInfo.css'
import COUNTRY_STORIES from '../data/countryStories'

function CountryInfo({ country, countries = [], onClose, lowered = false }) {
    const rows = countries.filter(r => r.country === country)
    const locations = [...new Set(rows.map(r => r.location).filter(Boolean))]
    const companyNames = [...new Set(rows.map(r => r.company).filter(Boolean))]
    const stories = COUNTRY_STORIES[country] ?? []

    return (
        <div className={`country-info ${lowered ? 'lowered' : ''}`}>
            <div className="country-info-header">
                <span>{country}</span>
                <button className="country-info-close" onClick={onClose}>×</button>
            </div>

            <div className="country-info-description">
                <span>{country} hosts {locations.length} delivery centers worked by
                    {' '}{companyNames.length} companies. These are:
                </span>
            </div>

            <ul className="country-info-list">
                {locations.map(loc => {
                    const row = rows.find(r => r.location === loc)
                    return (
                        <li key={loc}>
                            {loc}{row?.company ? `, ${row.company}` : ''}
                        </li>
                    )
                })}
            </ul>

            {stories.length > 0 && (
                <>
                    <div className="country-info-description">
                        <span>Visit the following stories to learn more about data workers in {country}:</span>
                    </div>
                    <ul className="country-info-list country-info-stories">
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
        </div>
    )
}

export default CountryInfo
