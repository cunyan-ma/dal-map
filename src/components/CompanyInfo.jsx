import './CompanyInfo.css'

function CompanyInfo({ company, countries = [], onClose }) {
    const rows = countries.filter(r => r.company === company)
    const locations = [...new Set(rows.map(r => r.location).filter(Boolean))]
    const countryNames = [...new Set(rows.map(r => r.country).filter(Boolean))]

    return (
        <div className="company-info">
            <div className="company-info-header">
                <span>{company}</span>
                <button className="company-info-close" onClick={onClose}>×</button>
            </div>

            <div className="company-info-description">
                <span>{company} has {locations.length} delivery centeres across 
                    {countryNames.length} countries. These are:
                </span>
            </div>

             <ul className="company-info-list">
                {locations.map(loc => {
                    const row = rows.find(r => r.location === loc)
                    return (
                        <li key={loc}>
                            {loc}{row?.country ? `, ${row.country}` : ''}
                        </li>
                    )
                })}
            </ul>

            <div className="company-info-description">
                <span>I will insert personalized information about the company's 
                    worker practice here, with relevant links. These will be written out later.
                </span>
            </div>

            {/* <div className="company-info-stat">
                <span className="company-info-label">Delivery centers</span>
                <span className="company-info-value">{locations.length}</span>
            </div>

            <ul className="company-info-list">
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
                <div className="company-info-stat">
                    <span className="company-info-label">Countries</span>
                    <span className="company-info-value">{countryNames.length}</span>
                </div>
            )} */}
        </div>
    )
}

export default CompanyInfo
