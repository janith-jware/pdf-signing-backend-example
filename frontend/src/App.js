import logo from './logo.svg';
import './App.css';

import React from 'react';
import SignaturePadComponent from './components/SignaturePad';

function App() {
  return (
    <div className="App">
      <h2>Contract Signing</h2>
      <div className='container'>
        <embed
          src="http://localhost:5000/contracts/contract.pdf"
          width="100%"
          height="500px"
          type="application/pdf"
        />
        <SignaturePadComponent />
      </div>

    </div>
  );
}

export default App;
