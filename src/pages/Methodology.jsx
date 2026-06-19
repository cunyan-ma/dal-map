import './Methodology.css'

function Methodology() {

    const introduction = "this is a general introduction to the method involved"
    const companies = "I did the following this to locate companies"
    const delivery = "and this is how I was able to locate their delivery centers"
    const customer = "I used resources from TechEquity's research"

    return (
        <div className="method-container">
            <h1>Methodology (very rough draft)</h1>
            <p>
                The data behind the map is collected via the following steps: 
                locate data labeling platforms, locate their worker delivery 
                centers, locate their custoemrs, then visualizing them via a 
                React app on leaflet library.
            </p>

            <br>
            </br>

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

            <h2>How were companies located</h2>
            <p>
                Lots of existing research done on this. TechEquity's Data Work 
                Landscape is a good starting point. Lots of industry reports. 
                All of these resources are combined together to get the most 
                comprehensive list of data labeling companies that exist in the 
                English media world. LLM is used to assist with cross-referncing 
                between existing resources.
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

            <h2>How were delivery centers located located</h2>
            <p>
                In most cases, delivery center = regional offices.

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
                All comapny + deliver center + source can be found via "database".             </p>

            <h2>Locating relatinoships between customers and companies</h2>
            <p>{customer}</p>

        </div>
    )
}

export default Methodology