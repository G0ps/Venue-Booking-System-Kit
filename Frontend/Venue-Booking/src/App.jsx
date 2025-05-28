import { useState, useEffect } from 'react'
import './App.css'

import { generalurl, usertorolesendpoint } from '../../../urls.mjs';

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${generalurl}${usertorolesendpoint}`)
      .then((res) => {
        console.log(res);
        
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json()
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="App">
            
      {/* Display fetched data or loading/error states */}
      <pre>
        {error && `Error: ${error}`}
        {!error && !data && 'Loading...'}
        {data && JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default App
