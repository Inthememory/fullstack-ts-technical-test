import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [message, setMessage] = useState<string>('Connecting to API...')

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        const response = await fetch('/metrics/snapshot')
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`)
        }
        setMessage(await response.text())
      } catch {
        setMessage('Could not connect to API')
      }
    }

    loadSnapshot()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full-stack TypeScript test</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <pre>{message}</pre>
      </header>
    </div>
  );
}

export default App;
