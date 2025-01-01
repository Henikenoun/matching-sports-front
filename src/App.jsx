import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import Menu from './components/Menu/Menu';
import Accueil from './components/Accueil';
import AdminDashboard from './components/Admin/AdminDashboard';
import FormulaireAbonnement from './components/FormulaireAbonnement';
import ReservationUser from './components/ReservationUser';
import AffichageProfil from './components/Profile/AffichageProfil';
import Register from './components/Authentification/Register';
import Login from './components/Authentification/Login';
import Logout from './components/Authentification/Logout';
import AfficheAbonnementUser from './components/AfficheAbonnementUser';
import AjouterTerrain from './components/Admin/AjouterTerrain';
import ListClubs from './components/UserInterface/ListClubs';
import ClubDetails from './components/UserInterface/ClubDetails';
import ClubsBySport from './components/UserInterface/ClubsBySport';
import Demandes from './components/userShop/Demandes';
import Articles from './components/userShop/Articles';
import Cart from './components/userShop/Cart';
import ListShop from './components/userShop/listshop';
import Reservation from './components/reservationUser/reservation';
import { CartProvider } from "use-shopping-cart";
import { ToastContainer } from 'react-toastify';
import Equipe from './components/reservationUser/Equipe';
import OwnerDashboard from './components/Admin/ownerDashboardHeni';

function App() {


  return (
    <>
 <CartProvider>
 <ToastContainer />
      <Router>
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/" element={<Accueil />} />
          <Route path="/Admin" element={<AdminDashboard />} />
          <Route path="/FormulaireAbonnement" element={<FormulaireAbonnement />} />
          <Route path="/ReservationUser" element={<ReservationUser />} />
          <Route path="/AffichageProfil" element={<AffichageProfil />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/AfficheAbonnementUser" element={<AfficheAbonnementUser />} />
          <Route path="/AjouterTerrain" element={<AjouterTerrain />} />
          <Route path="/Clubs" element={<ListClubs />} />
          <Route path="/clubs/:clubId" element={<ClubDetails />} />
          <Route path="/clubs-by-sport" element={<ClubsBySport />} />
         {/*  el haa  */}
          <Route path="/ReservationUser" element={<ReservationUser />} />
          <Route path="/reser" element={<Reservation />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/shop" element={<ListShop />} />
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          
        </Routes>

      </Router>
    </CartProvider>
    </>
  )
}

export default App
