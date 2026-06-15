import './Methodology.css'

function Methodology() {

    const introduction = "this is a general introduction to the method involved"
    const companies = "I did the following this to locate companies"
    const delivery = "and this is how I was able to locate their delivery centers"

    return (
        <div className="method-container">
            <h1>Methodology</h1>
            <p>{introduction}</p>

            <h2>How were companies located</h2>
            <p>{companies}</p>

            <h2>How were delivery centers located located</h2>
            <p>{delivery}</p>

        </div>
    )
}

export default Methodology