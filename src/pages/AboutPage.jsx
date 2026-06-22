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
            <br></br>
            <p>
                This map visualizes the geographic locations of data workers
                behind AI. It provides the first systematic and
                quantitative documentation of workers' distribution around the
                world by tracking data labeling platforms' worker
                delivery centers. This interactive map positions data workers
                as part of a supply chain in the global AI system, connecting
                them with data labeling platforms and each platform's known
                customers that contract for data labeling services.
            </p>
            <br></br>
            <p>
                This map is part of the data journalism series: where is the
                material supply chain behind AI? *insert hyperlink here after
                finished* *I will also explain the "power mapping" framework
                here*
            </p>

            <p>
                All methodology, including any LLM use, is documented in the
                Methodology page.
            </p>
            <br></br>

            <h2 id="how-to-use">How to use this project</h2>
            <br></br>
            <p>
                1. Download the original database to access platform-specific locations
                of data workers.
            </p>
            <br></br>
            <p>2. Browse around the map, explore the linkage between customers,
                platforms, and workers. Through the visual distribution and the
                worker country profiles, we hope that users can seriously ponder
                where power is concentrated behind modern-day AI systems. What
                does that implicate about this technology we build, and how
                should we change that?
            </p>

            <br></br>

            <h2 id="background">Background (unfinished)</h2>
            <br></br>

            <p>
                *unfinished* In order for machines to understand a piece of
                data, it has to be annotated. These are data workers, who makes
                up the foundation of the AI industry.
            </p>
            <p>
                *ufinished* Data work is lot more nuanced industry in the age of
                LLM. 
                <ul>
                    <li>Scaling law = needs lots more generic data = data workers
                in higher demand. this will grow as AI advances into different fields.
                recent reporting on Indian workers wearing headset to train AI 
                on doing housework</li>
                    <li>Reinforcement Learning through Human Feedback = read 
                        AIGC. include traumatizing material on sexual abuse, violence, etc
                    </li>
                    <li>Domain knowledge. shifts the class character of the job. 
                        folks who are replaced out of job due to AI are now training AI 
                        to better replace jobs.
                    </li>
                </ul>
                
            </p>
            <p>
                Thanks to some incredible journalists, the story of data workers
                have surfaced to us more as AI became a larger part of our
                lives. We know that some of them locate in Kenya, Venezuela,
                and other countries with English literacy but poor economic
                conditions, enabling exploitation. We know that they are
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



            <h2 id="cite">Cite this work</h2>
            <p>
                A CNTR project by Cunyan Ma.
                (insert cite)
            </p>

            <h2 id="bibliography">Bibliography</h2>
            <p>
                *This page should be folded up* *would be a long long list*
            </p>
        </div>
    )
}

export default AboutPage