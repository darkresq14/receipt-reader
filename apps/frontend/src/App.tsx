import { useEffect, useState } from 'react'
import type { BackendStatusDTO } from '@receipt-reader/shared-types'

function App() {
  const [backendStatus, setBackendStatus] = useState<BackendStatusDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  return (
    <>
      <h1>Receipt Reader</h1>
      <div>
        <h2>Backend Connection</h2>
        {isLoading && <p>Checking connection...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {backendStatus && (
          <div style={{ color: 'green' }}>
            <p>Status: {backendStatus.status}</p>
            <p>{backendStatus.message}</p>
            <small>Timestamp: {backendStatus.timestamp}</small>
          </div>
        )}
      </div>
    </>
  )
}

export default App
