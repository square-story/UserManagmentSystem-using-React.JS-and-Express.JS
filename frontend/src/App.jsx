import './App.css'
import Login from './pages/Login/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDetails from './pages/User/UserDetails/UserDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Admin/Dashboard';
import { AdminRoute } from './pages/Admin/AdminRoute';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/userdetails" element={<UserDetails />} />
        </Route>
        {/* Admin-only Route */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
