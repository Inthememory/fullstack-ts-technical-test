import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [message, setMessage] = useState<string>('')
  useEffect(() => {
    const myf = async () => {
        const response = await fetch('http://localhost:3000/metrics/snapshot')
      const mess = await response.text()
      setMessage(mess)
      }
      myf()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
          {message}
      </header>
    </div>
  );
}

export default App;
