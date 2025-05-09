import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home   from './pages/Home';
import Skill from './pages/Skill';
import Introduction from './pages/introduction';
import Experience from './pages/Experience';
import Project from './pages/project';
import Award from './pages/Award';
import Other from './pages/Other';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/project" element={<Project />} />
          <Route path="/award" element={<Award />} />
          <Route path="/other" element={<Other />} />
        </Routes>
      <Footer />

    </BrowserRouter>
  );
}
