import { useState, useEffect } from 'react'
import './Database.css'

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.map(line => {
    const cols = []
    let cur = ''
    let inQuote = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQuote = !inQuote
      } else if (ch === ',' && !inQuote) {
        cols.push(cur)
        cur = ''
      } else {
        cur += ch
      }
    }
    cols.push(cur)
    return cols
  })
}

function useCSV(url) {
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setLoading(false)
      return
    }
    fetch(url)
      .then(r => r.text())
      .then(text => {
        const parsed = parseCSV(text)
        if (parsed.length > 0) {
          setHeaders(parsed[0])
          setRows(parsed.slice(1))
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load database.')
        setLoading(false)
      })
  }, [url])

  return { headers, rows, loading, error }
}

function TablePreview({ headers, rows }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DatabaseColumn({ title, href, description, data, placeholder }) {
  return (
    <div className="db-column">
      <a className="db-column-title" href={href} target="_blank" rel="noreferrer">
        {title}
      </a>
      <p className="db-column-desc">{description}</p>
      {placeholder ? (
        <div className="db-preview-placeholder" />
      ) : data.loading ? (
        <div className="db-preview-placeholder">
          <span className="db-status">Loading...</span>
        </div>
      ) : data.error ? (
        <div className="db-preview-placeholder">
          <span className="db-status db-error">{data.error}</span>
        </div>
      ) : (
        <TablePreview headers={data.headers} rows={data.rows} />
      )}
    </div>
  )
}

const BASE = import.meta.env.BASE_URL

function Database() {
  const workerLocation = useCSV(`${BASE}worker-location.csv`)
  const dalPlatforms = useCSV(`${BASE}dal-platforms.csv`)
  const platCustomer = useCSV(`${BASE}platform-customer.csv`)

  return (
    <div className="database-page">
      <div className="database-header">
        <h1>Database</h1>
        <p className="database-subtitle">
          This map is supported by three database:
          <ul>
            <li>
              worker-location.csv: an original database constructed by the 
              project. It tracks worker location by country, city, and the 
              platform that employes them.
            </li>
            <li>
              dal-platforms.csv: Lists the DAL BPO platforms that are included 
              in this map due to their public available information on delivery 
              centers
            </li>
            <li>
              platform-customer.csv: sourced from TechEquity, cleaned to match
               the data structure required by this map
            </li>
            </ul> 
        </p>
      </div>

      <div className="db-columns">
        <DatabaseColumn
          title="worker-location.csv"
          href={`${BASE}worker-location.csv`}
          //description="The original database behind the map. Tabs worker location by country and the platform they serve"
          data={workerLocation}
        />
        <DatabaseColumn
          title="dal-platform.csv"
          href={`${BASE}dal-platforms.csv`}
          //description="Filtered list of DAL platforms that operate as BPO with traceable worker location"
          data={dalPlatforms}
        />
        <DatabaseColumn
          title="platform-customer.csv"
          href={`${BASE}platform-customer.csv`}
          //description="Sourced from TechEquity, cleaned to match the data structure required by this map."
          data={platCustomer}
        />
      </div>
    </div>
  )
}

export default Database
