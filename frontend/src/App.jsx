import './App.css'
import Login from './pages/Login/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDetails from './pages/User/UserDetails/UserDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/userdetails" element={<UserDetails />} />
      </Routes>
    </Router>
  )
}

export default App
