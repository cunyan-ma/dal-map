import './AboutPage.css'

function AboutPage() {
    const methodology = [
        'Triangulation across payment rails, academic surveys, and investigative journalism',
        'SEC filings and subsidiary lists for corporate structure',
        'Company location pages and career postings for geographic presence'
    ]

    return (
        <div className="about-container">
            <h1>About this project (very rough draft)</h1>
            <p>
                This map tracks the geographic locations of data workers
                who annotate data to render them legible to machine with little
                pay or recognition. It provides the first systematic and
                quantitative documentation of workers' geographic region,
                visualized via an interactive global map that ties workers
                around the globe with contracting platforms and custmers
                concentrated in the Western world.
            </p>
            <br></br>
            <p>
                This map is part of the data journalism series: where is the
                material supply chain behind AI? *insert hyperlink here after finished*
            </p>

            <h2>Background</h2>
            <p>
                Thanks to some incredible journalists, the story of data workers
                have surfaced to us more as AI became a larger part of our
                lives. We know that some of them locate in Kenya, Venezuela,
                and other countries with English literacy but poor economic
                conditions which enable exploitation. We know that they are
                subjected to gruesome work, often made to work with traumatizing
                material with no redress from their supposed employees--the
                "data labeling platforms" that pass down contracts from
                mysterious customers.

            </p>
            <br></br>
            <p>
                More than anything, we know that the Data Annotation and
                Labeling (DAL) industry is an incredibly opaque industry by
                design. Half of the industry operates as gig platforms, which
                treats workers as "contractors" rather than "workers", obscuring
                away any detail on worker number, location, wage, etc to the
                public.
            </p>

            <br></br>
            <p>
                The other half of the industry, however, operates as "Business
                Process Outsourcing" (BPO) companies. These companies receive
                data labeling contracts outsourced from AI companies, then pass
                them along to their in-house annotation teams assembled across
                "delivery centers" across the world. The locations of these
                delivery centers are chosen deliberately. Not only do the
                companies need to guarantee company network, these locations
                also often have abundant of workers who look for lower pay due
                to their countries' historic, social, or economic conditions.
            </p>

            <br></br>
            <p>
                This map tracks the worker location for the second type of
                companies.
            </p>

            <br></br>

            <h2>Methodology</h2>

            <p>

            </p>

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