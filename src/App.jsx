import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { useLenis } from './lib/useLenis';
import Home from './pages/Home';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Audit from './pages/Audit';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  useLenis();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="audit" element={<Audit />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
