import { Routes, Route } from 'react-router-dom';
import AppNavbar from './Navbar';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Branches from '../pages/Branches';

function DashboardApp() {
  return (
    <>
      <AppNavbar /> {/* Navbar solo dentro del dashboard */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="branches" element={<Branches />} />
        </Routes>
      </div>
    </>
  );
}

export default DashboardApp;
