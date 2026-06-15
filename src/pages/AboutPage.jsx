import './AboutPage.css'

function AboutPage() {
    const methodology = [
        'Triangulation across payment rails, academic surveys, and investigative journalism',
        'SEC filings and subsidiary lists for corporate structure',
        'Company location pages and career postings for geographic presence'
    ]

    return (
        <div className="about-container">
            <h1>About this project</h1>
            <p>
                This map visualizes the geographic footprint of the global data
                labeling industry, focusing on where companies maintain teams
                rather than where they are headquartered.
            </p>

            <h2>Methodology</h2>
            <ul>
                {methodology.map(item => (
                    <li key={item}>{item}</li>
                ))}
            </ul>

            <h2>Data source</h2>
            <p>
                All entries are sourced from public filings, company websites,
                and academic research. See the full methodology sheet for
                confidence ratings and source URLs.
            </p>
        </div>
    )
}

export default AboutPage