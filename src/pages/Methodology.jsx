import './Methodology.css'

function Methodology() {

    return (
        <div className="method-container">
            <h1>Methodology</h1>
            <p>
                The data behind the map is collected via the following steps:
                locate data labeling platforms, locate their worker delivery
                centers, locate their custoemrs, then visualizing them via a
                React app on leaflet library.
            </p>

            <br></br>

            <p>
                It's important to highlight that this map is not a comprehensive
                database of ALL BPO data labeling companies and ALL of their
                delivery centers. The magnitude of search is incredible,
                therefore this is a live project that will need continual
                updating. The author is less concerned with capturing the
                entirety of the data labeling companies, but more to display a
                consistent pattern across the industry--where are the workers
                located across the world, and what type of customers do they
                serve?
            </p>

            <h2>Locating data labeling platforms</h2>
            <p>
                Lots of existing research done on this. TechEquity's Data Work
                Landscape is a good starting point. Lots of industry reports.
                All of these resources are combined together to get the most
                comprehensive list of data labeling companies that exist in the
                English media world. These resources are searched manually. 
                LLM is used to assist with cross-referncing between existing 
                resources.
            </p>

            <br>
            </br>

            <p>
                After a list of companies is collected, we do desk research on
                each company to determine their business model. TechEquity's
                database already includes some of those information. The BPO
                ones are preserved for the scope of this project. Their HQ info
                is pulled from web as publicly avaialble info.
            </p>

            <br>
            </br>

            <p>
                Not all BPO companies are immediately included on the map. Its
                delivery centers have to be discoverable. More on that in the
                next section.
            </p>

            <h2>Locating platforms' worker delivery centers</h2>
            <p>
                In most cases, a platform's delivery center = their regional
                offices.

            </p>

            <br>
            </br>

            <p>
                For publicly traded companies--which makes up an incredibly
                small fraction of the ecosystem--this information is available
                via their SEC 10-K Exhibit 21, subsidiary information. For
                private companies, this can be searched either from their
                LinkedIn or website. Not all private companies release this
                information. Specificity of address is not guaranteed,
                entirely based on how much info the company can provide.
            </p>

            <br>
            </br>

            <p>
                For this step, the author used LLM to filter out companies with
                little disclosed information by asking it to try locate their
                regional offices. The author will not yet spend time to look
                into companies that even LLM cannot find information for. For
                any company that LLM tags with available informatino, the author
                will conduct desk search until locating an exact source.
                Otherwise the company is not included in the map.
                All comapny + deliver center + source can be found via "database".
            </p>

            <h2>Locating platforms' customers</h2>
            <p>
                At the early stage of mapping, the author uses the
                database from TechEquity, which contains some publicly available
                information regarding data labeling platforms and AI companies
                who seek such services. We recognize that this database is not
                complete, and as TechEquity themselves poignantly pointed out,
                many data labeling platforms deliberately keep their customer
                information discrete.
            </p>

            <h2>Geocoding</h2>
            <p>
                Information regarding platforms, their delivery centers, and
                their respective customers are munually compiled into a SQL
                database. During the manual process, the author guarantees
                city-level specificity of these entities' locations. Then, an
                API query to a lat/lng coordinate company is called upon each
                location. These lat/lng are read into the leaflet map and
                eventually visualized as white/orange/red nodes on the map.
            </p>

            <h2>Contextualizing worker countries</h2>
            <p>
                *unfinished* all manually compiled, by doing deep research into
                each company's history in DAL industry, their English literacy
                level, etc.
            </p>

        </div>
    )
}

export default Methodology