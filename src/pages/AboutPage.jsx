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

            <h2 id="background">Background</h2>
            <br></br>

            <p>
                In order for machines to understand a piece of data, it has to be annotated. This act of annotation is performed by data workers in the data annotation and labeling (DAL) industry, who make up the foundation of the AI industry.

            </p>
             <br></br>
            <p>
                Data work has become a far more nuanced industry in the age of LLMs.

                <ul>
                    <li>Scaling law: Building LLMs requires a vast amount of generic data, thereby expanding the DAL industry into new magnitudes. As AI advances into new fields, demand for data workers grows with it. Recent reporting out of Tamil Nadu, India shows workers strapping head-mounted cameras to themselves to film everyday chores so that humanoid robots can eventually learn to do the same.
</li>
                    <li>Reinforcement Learning through Human Feedback (RLHF): Training AIGC requires human raters to review and label that content, including material depicting sexual abuse, violence, and other traumatizing content.

                    </li>
                    <li>Domain knowledge: Workers with specialized expertise are recruited to label data in their own field. The same people being automated out of their professions are, in some cases, the ones training the AI that replaces them.

                    </li>
                </ul>
                
            </p>
            <p>
                Thanks to some incredible journalists, the story of data workers
                have surfaced to us more as AI became a larger part of our
                lives. We know that some of them locate in Kenya, Venezuela,
                and other countries with English literacy but poor economic
                conditions, enabling exploitation. We know that they are
                sometimes made to work with traumatizing
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