import React from 'react';
import './UnderDev.css';

function App() {
  return (
    <div className="App">
      <div className="overlay">
        <div className="content">
          <h1>Update</h1>
          <p>We’re making updates to our page. Stay tuned for something new!</p>
          <div className="loader"></div>
          <div className="coming-soon">
            <p>We'll be back on <strong>5th December 2024</strong>!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

