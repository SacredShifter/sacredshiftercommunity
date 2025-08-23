import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Circles } from './pages/Circles';
import { Journal } from './pages/Journal';
import { Codex } from './pages/Codex';
import { Breath } from './pages/Breath';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/breath" element={<Breath />} />
      </Routes>
    </BrowserRouter>
  );
}