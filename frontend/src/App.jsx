import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home   from './pages/Home';
import Skill from './pages/Skill';
import Introduction from './pages/introduction';
import Experience from './pages/Experience';
import Project from './pages/project';

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
        </Routes>

    </BrowserRouter>
  );
}
