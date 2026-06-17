import { useState, useEffect } from 'react'
import './Database.css'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTSF7sVqlLv16NeJJJZxSDvxwgUK74I7zm0IDqs8x5Aq1pzSFXlnpIJVXTX4cy0339tXLU7U2GMWFPG/pub?gid=1725569278&single=true&output=csv'

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

function Database() {
  const [rows, setRows] = useState([])
  const [headers, setHeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(CSV_URL)
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
  }, [])

  return (
    <div className="database-page">
      <div className="database-header">
        <h1>Database</h1>
        <a
          className="download-btn"
          href={CSV_URL}
          download="database.csv"
          target="_blank"
          rel="noreferrer"
        >
          Download CSV
        </a>
      </div>
      {loading && <p className="db-status">Loading...</p>}
      {error && <p className="db-status db-error">{error}</p>}
      {!loading && !error && (
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
      )}
    </div>
  )
}

export default Database
