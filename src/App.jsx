import { useState } from 'react'
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";

import Menu from './components/Menu/Menu';
import Accueil from './components/Accueil';
import AdminDashboard from './components/Admin/AdminDashboard';
import FormulaireAbonnement from './components/FormulaireAbonnement';
import ReservationUser from './components/ReservationUser';
import AffichageProfil from './components/Profile/AffichageProfil';
import Register from './components/Authentification/Register';
import Login from './components/Authentification/Login';
import Logout from './components/Authentification/Logout';
function App() {
  

  return (
    <>
      <Router>
      <Routes>
      <Route path="/menu"element={<Menu/>}/>
      <Route path="/"element={<Accueil/>}/>
      <Route path="/Admin" element={<AdminDashboard />} />
      <Route path="/FormulaireAbonnement" element={<FormulaireAbonnement />} />
      <Route path="/ReservationUser" element={<ReservationUser />} />
      <Route path="/AffichageProfil" element={<AffichageProfil />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Logout" element={<Logout />} />
      
      </Routes>

      </Router>
    </>
  )
}

export default App
