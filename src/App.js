import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import XmlDisplay from './components/XmlDisplay';
import DagreLayout from './components/DagreLayout';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/rabbis-sephardic">Rabbis-Sephardic</Link>
            </li>
            <li>
              <Link to="/rishonim">Rishonim</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/rabbis-sephardic" element={<XmlDisplay filename="/data/Rishonim.xml" />} />
          <Route path="/rishonim" element={<XmlDisplay filename="/data/Rishonim.xml" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
