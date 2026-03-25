import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Catalogo from "./pages/Catalogo";
import CartDialog from "./components/CartDialog";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/users/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Checkout from "./pages/Checkout";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Register from "./pages/users/Register";
import Profile from "./pages/users/Profile";

function App() {
  return (
      <Router>
        <Navbar />
        <Toaster position="bottom-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/cat" element={ <Catalogo /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/checkout" element={ <Checkout /> } />
          <Route path="/register" element={ <Register /> } />

          <Route 
            path="/profile" 
            element={
                <ProtectedRoutes allowedRoles={["admin", "user"]}>
                  <Profile />
                </ProtectedRoutes>
            } 
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route path="panel" element={ <AdminPanel /> } />
            <Route path="dashboard" element={ <Dashboard /> } />
          </Route>
        </Routes>
        <CartDialog />
      </Router>
  )
}

export default App
