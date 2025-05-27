import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/getUsers')
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
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>
      
      {/* Display fetched data or loading/error states */}
      <pre>
        {error && `Error: ${error}`}
        {!error && !data && 'Loading...'}
        {data && JSON.stringify(data, null, 2)}
      </pre>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
