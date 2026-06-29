import './Methodology.css'

function Methodology() {

    return (
        <div className="method-container">
            <h1>Methodology</h1>
            <p>
                This map documents the labor geography of the AI data labeling
                and annotation (DAL) industry. Specifically, it visualizes
                prominent business-process-outsourcing (BPO) data labeling
                platforms (see About - Background), their worker delivery
                centers, and their customers into the following supply chain:
            </p>
            <blockquote>
                <strong style={{ color: '#ffffff' }}>Customer</strong> - <strong style={{ color: '#f2572d' }}>Platform</strong> - <strong style={{ color: '#c51818' }}>Worker</strong>
            </blockquote>

            <p>
                To construct the full supply chain, we:
                <ul>
                    <li>Identified data labeling platforms with a BPO
                        business model</li>
                    <li>Identify platforms' worker delivery centers</li>
                    <li>Identify platforms' customers</li>
                    <li>Geocode these locations into map coordinates for
                        visualization.</li>
                </ul>
            </p>

            <br></br>

            <p>
                It's important to highlight that this map is not a comprehensive
                database of all BPO data labeling companies and all of their
                delivery centers. The goal is not to build an exhaustive
                inventory, but rather to display a consistent pattern across
                the industry: What is the structural relationship between AI
                company customers, the data labeling platforms that intermediate
                labor, and the workers who receive little recognition or pay?

            </p>
            <p>
                <br></br>

                Despite narrowing scope to BPO platforms only, the industry
                remains deliberately opaque. Due to the lack of publicly
                available information, almost all search is done manually,
                building on top of resources created by previous researchers.
                The project is updated on an ongoing basis as new sources are
                identified, and a company's absence from the map should be read
                as "not yet verifiable," not "does not exist."

            </p>

            <p>
                Also important to note is that currently the project is scoped
                within the English media world.
                While the English media world is an
                incomplete scope--ie, it likely misses out the AI data labeling
                supply chain in China, it nevertheless captures enough
                information since the AI startup ecosystem happens most actively
                in the Silicon Valley.
            </p>

            <p>plenty of limitation in presenting the most accurate description 
                of "power". delivery center is found to be the closest estimate, 
                but does not capture the size of each delivery center, comapny 
                reliance, etc. two highly saturated companies can heavily skew 
                the weight of a location on the map--eg, india in this case. 
                one would also expect a lot more in south america and africa.
            </p>

            <h2 id="identify-platforms">Identify BPO DAL platforms</h2>
            <p>Download BPO DAL platforms featured on the map</p>
            <br>
            </br>
            <p>need to first explain how DAL platforms are defined. most 
                DAL platforms work on more than DAL. therefore, any operation 
                that includes DAL would be listed??
            </p>
            <p>
                To identify data labeling platforms, we referenced
                many existing resources, including TechEquity's
                <a href="https://dataworklandscape.org/database">
                    Data Work Landscape database</a>, which includes
                a list of data labeling platforms compiled thorugh
                systematic Google search; and various industry reports, which lists
                top performing data labeling platforms. These resources are
                searched manually.

            </p>

            <br>
            </br>

            <p>
                All data labeling companies mentioned in these resources are
                compiled into a comprehensive list of data labeling companies that exist in the
                English media world. LLM is used to assist with cross-referencing between
                existing resources to avoid duplicates between lists.
            </p>

            <br>
            </br>

            <p>
                After gathering a comprehensive list, we then do desk search
                to determine whether each company operates as BPO.
                TechEquity's database already includes some of those information.
                Only BPO platforms are selected for the scope of this project.
                Companies that use a mix of BPO & marketplace models are also
                included.
            </p>

            <br>
            </br>

            <p>
                Not all BPO companies are included on the map. Its
                delivery centers have to be discoverable. More on that in the
                next section.
            </p>

            <h2 id="delivery-centers">Identifying worker delivery centers</h2>
            <p>Download worker locations featured on this map</p>
            <br>
            </br>
            <p>
                For most BPO platforms, worker delivery centers refer to the
                assemblage of annotation teams across its regonal offices.
                Therefore, we used "regional office" as the first anchor to identify delivery
                center. For companies that do not disclose the specific 
                functions of its regional office, we see if the platform provide 
                services other than data labeling. If yes, than the 
                regional offices is not a reasonable approimate, therefore the 
                platform is excluded from the list. Some companies disclose the specific functions of
                its regional offices. In these cases, we manually judge if
                the regional office can be listed as a delivery center or not. 
                
            </p>

            <br>
            </br>

            <p>
                For publicly traded companies--an incredibly
                small fraction of the ecosystem--this information is available
                via their SEC 10-K Exhibit 21 subsidiary list. For
                private companies, it is searched from their
                LinkedIn or website. Not all private companies disclose this information,
                and disclosure varies in specificity: most release a city-level address
                for their regional offices, some only a country, and others none at all. All of these search is done manually.
            </p>

            <br>
            </br>

            <p>
                LLMs are used as an information-landscape filter to prioritize search
                order across the ~100 data labeling platforms in scope. Some platforms
                have substantially more public information available than others.
                Because an LLM draws on a broad cross-section of the web rather than the
                SEO- and ad-influenced results a typical Google search surfaces, it
                offers a faster first pass at gauging which companies have discoverable
                information before committing to manual research.
            </p>

            <p>
                For each company, the LLM is given the following prompt:
            </p>

            <blockquote>
                "Find the in-house annotation team delivery center for these data
                labeling companies. Cite any sources used. Clearly state 'nothing
                found' if no information can be located. Rank certainty as
                high, middle, or low."
            </blockquote>


            <p>
                Companies the LLM identifies with high certainty are searched manually
                first, followed by those with uncertain (middle or low) results. As of
                this writing, manual search has not yet extended to companies for which
                the LLM found no information at all.
            </p>

            <h2 id="customers">Identifying customers</h2>
            <p>
                At the early stage of mapping, customer data is sourced
                primarily from TechEquity's existing research on publicly
                disclosed client relationships. This dataset is incomplete, as
                platforms frequently withhold client information,
                sometimes at the client's request. Customer data here is a
                documented floor, not a complete picture.
            </p>

            <h2 id="geocoding">Geocoding</h2>
            <p>
                Platform, delivery center, and customer information are compiled
                into a SQL database. City-level specificity of these entities'
                locations is manually guaranteed. A geocoding API converts these
                to latitude/longitude coordinates, rendered as nodes on the
                Leaflet map. <strong style={{ color: '#ffffff' }}>White</strong> marks customers contracting data labeling
                services, <strong style={{ color: '#f2572d' }}>orange</strong> marks the DAL platforms providing those
                services, and <strong style={{ color: '#c51818' }}>red</strong> marks worker delivery center locations.

            </p>

            <h2 id="worker-countries">Contextualizing worker countries</h2>
            <p>
                *unfinished* all manually compiled, by doing deep research into
                each company's history in DAL industry, their English literacy
                level, etc.
            </p>

        </div>
    )
}

export default Methodology