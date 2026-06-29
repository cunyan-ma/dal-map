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
            <br />
            <p>All database used in this project is open-sourced in the "Database" 
                page.</p>

            <h2>Key Limitations</h2>
            <br />

            <p><b>A pattern, rather than an exhaustive landscape</b></p>


            <p>
                This map is not a comprehensive
                database of all BPO data labeling platforms and all of their
                delivery centers. Despite narrowing scope to BPO platforms only, the industry
                remains deliberately opaque, as the companies are under no legal
                requirements to disclose information regarding their delivery
                centers and customers. Almost all search is done manually,
                building on top of resources created by previous researchers.
                Therfore, only publicly available information is documented on the
                map. The project is updated on an ongoing basis as new sources are
                identified, and a company's absence from the map should be read
                as "not yet verifiable," not "does not exist."
            </p>

            <br />

            <p><b>An imperfect capture of "power" within DAL industry</b></p>

            <p>The map acknowledges that the distribution of delivery centers
                across the world is an imperfect capture of the "power" that the
                DAL industry exerts upon labor worldwide. DAL platforms disclose 
                their delivery center at varying scopes, some at the country 
                level, some to city, and some to specific offices--each would 
                indicate an uneven concentration of worker location across 
                the map. The presence of a
                delivery center cannot indicate workforce size or industry
                reliance, and absence only suggests an absence in the given pool
                of documented DAL platforms. Given the small sample size,
                a few platforms that are highly-saturated in certain regions can
                also heavily skew the distribution--eg, DesiCrew and NextWealth
                in India. Nevertheless, this map serves as a
                useful anchor in understanding existing patterns of worker
                distribution. More research is needed to uncover the full picture.
            </p>
            <br />

            <p><b>Scoped within the English media world</b></p>


            <p> *unfinished* Currently, this map only contains information available in the
                English media world. The map acknowlwedges that this overlooks
                a large ecosystem of Chinese DAL industry. This is partially by
                design, however, as the map is interested in understanding a
                global DAL industry pattern that is championed by western
                interests and capital, wheras the Chinese ecosystem is far more
                self-reliant.
            </p>

            <br />

            <h2 id="identify-platforms">Identify BPO DAL platforms</h2>
            <br>
            </br>
            <p>Many DAL platforms also provide broader IT services, and many 
                operate using a hybrid of the BPO and marketplace business 
                models. For the purposes of this project, any platform that 
                offers DAL services and incorporates a BPO component is 
                included, even if it also engages in other operations or 
                business models.
            </p>
            <br />
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
                Not all BPO companies are included on the map. Its
                delivery centers have to be discoverable. More on that in the
                next section.
            </p>
            <br />

            <h2 id="delivery-centers">Identifying worker delivery centers</h2>
            <br>
            </br>
            <p>
                For most BPO platforms, worker delivery centers refer to the
                assemblage of annotation teams across its regonal offices.
                Therefore, we used "regional office" as the first anchor to identify delivery
                center. Some platforms disclose the specific functions of its 
                regional offices and would clearly lable "delivery center" among 
                these. Otherwise, "regional office" cannot safely translate to 
                "delivery center" in most cases. For instance, some regional offics are operation centers. 
                Some delivery centers are shared with other IT services that the 
                same platform offers. These are judged manually on a case-by-case 
                basis.

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