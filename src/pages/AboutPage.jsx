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
                quantitative documentation of data workers' distribution around the
                world by tracking data annotation and labeling (DAL) platforms' worker
                delivery centers, a first step towards making this opaque 
                industry more transparent. This interactive map positions data workers
                as part of a supply chain in the global AI DAL industry. 
                It display a consistent pattern across
                the industry: What is the structural relationship between AI
                company customers, the data labeling platforms that intermediate
                labor, and the workers who receive little recognition or pay?
            </p>
            <br></br>
            <p>
                This map is part of the data journalism series: where is the
                material supply chain behind AI? *insert hyperlink here after
                finished* *I will also explain the "power mapping" framework
                here*
            </p>

            <p>
                All methodology and limitations, including any LLM use, is documented in the
                Methodology page.
            </p>
            <br></br>

            <h2 id="how-to-use">How to use this project</h2>
            <ul>
                <li>
                    Download the original database to access platform-specific locations
                    of data workers.
                </li>
                <li>
                    Click "Explore the data worker story" to learn about data workers
                    throughout the world with the interactive map.
                </li>
                <li>
                    Learn about each platform, customer, and worker location, 
                    as well as the relationships among them. Do so by
                    clicking into each node for entity information; hover on 
                    a node to explore its linkage with other entities; 
                    use the search box for any specific entity; or use "show 
                    relationships" to map out the edges between entities.
                </li>
            </ul>
            <p>
                Through the visual distribution and the
                worker country profiles, we hope that users can interrogate 
                the concentration of power behind modern-day AI systems. What
                does that implicate about this technology we build, what systems 
                of power is it inheriting and perpetrating, and how
                should we change that?
            </p>

            <br></br>

            <h2 id="background">Background</h2>
            <br></br>

            <p>
                In order for machines to understand a piece of data, it has to 
                be annotated. This act of annotation is performed by data 
                workers in the data annotation and labeling (DAL) industry, 
                who make up the foundation of the AI industry.
            </p>
            <br />
            <p>
                This is an incredibly opaque industry byy
                design. Half of the industry operates as gig platforms, which
                treats workers as "contractors" rather than "workers", obscuring
                away any detail on worker number, location, wage, and more, to the
                public. 
            </p>
            <br></br>
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
            <br />
            <p>
                However, there is yet to be any systematic documentation of 
                where these data workers are located. Reliance on journalist 
                reporting is unable to provide a hollistic overview on the pattern 
                between worker exploitation and the companies that seek profit 
                from them. 
            </p>
            <br />
            <p>
                This project attempts to construct a database that documents 
                worker location quantitatively and systematically. It does so 
                by tracking down the DAL platforms that operate on a "Business 
                Process Outsourcing" (BPO) Business Model. These companies receive
                data labeling contracts outsourced from AI companies, then pass
                them along to their in-house annotation teams assembled across
                "delivery centers" across the world. The locations of these
                delivery centers are chosen deliberately. Not only do the
                companies need to guarantee company network, these locations
                also often have abundant of workers who look for lower pay due
                to their countries' historic, social, or economic conditions.
            </p>
            {/* <p>
                Data work has become more nuanced in the age of LLMs.

                <ul>
                    <li>Scaling law: Building LLMs requires a vast amount of 
                        generic data, thereby expanding the DAL industry into 
                        new magnitudes. 
                    </li>
                    <li>Reinforcement Learning through Human Feedback (RLHF): 
                        Training AI generated content requires human raters 
                        to review and label that content, including material depicting sexual 
                        abuse, violence, and other traumatizing content.

                    </li>
                    <li>Domain knowledge: Workers with specialized expertise 
                        are recruited to label data in their own field. The 
                        same people being automated out of their professions 
                        are, in some cases, the ones training the AI that 
                        replaces them.

                    </li>
                </ul>

            </p> */}
            
            <br></br>
            <p>
                This documentation is nevertheless imperfect. Information 
                remains opaque in these BPO platforms, although it's much more 
                available compared to gig platforms. The overlap between 
                DAL services and the platforms that provide these services is 
                imperfect, making scoping a difficult tradeoff.
            </p>
            <br />
            <p>
                For more notes on methodology and limitation, see Methodology page.
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