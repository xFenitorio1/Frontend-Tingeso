import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/customer/Home';
import PackageDetails from './pages/customer/PackageDetails';
import Checkout from './pages/customer/Checkout';
import AdminLayout from './pages/admin/AdminLayout';
import Inventory from './pages/admin/Inventory';
import Reports from './pages/admin/Reports';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-inter">
        <Navbar />
        <main>
          <Routes>
            {/* Customer Portal */}
            <Route path="/" element={<Home />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
