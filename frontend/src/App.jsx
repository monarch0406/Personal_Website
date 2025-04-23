import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home   from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

    </BrowserRouter>
  );
}


