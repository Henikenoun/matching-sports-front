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
import SupAdDashoard from './components/SuperAdmin/SupAdDashoard';
import AfficheClubs from './components/SuperAdmin/AfficheClubs';
import AjouterClub from './components/SuperAdmin/AjouterClub';
import AfficheUsers from './components/SuperAdmin/AfficheUsers';
import AjouteAdmin from './components/SuperAdmin/AjouteAdmin';
import AfficheAdmins from './components/SuperAdmin/AfficheAdmins';
import AfficherShops from './components/SuperAdmin/AfficherShops';
import OwnerDashboar from './components/Owner/OwnerDashboar';
import AfficheEvenementUser from './components/UserInterface/AfficheEvenementUser';
import Eventuser from './components/UserInterface/eventuser';
import Conversation from './components/reservationUser/Conversation';
import MyConversations from './components/reservationUser/Myconversations';
import Notification from './components/Notifications/Notification';
import Reservations from './components/reservationUser/allReservatin';
import DetailsReservations from './components/reservationUser/DetailsReservations';
import NotificationPage from './components/Notifications/not';



function App() {


  return (
    <>
      <CartProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/menu" element={<Menu />} />
            <Route path="/" element={<Accueil />} />
            
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
           
            <Route path="/SupAdmin" element={<SupAdDashoard />} />
            <Route path="/AfficheClubs" element={<AfficheClubs />} />
            <Route path="/AjouterClub" element={<AjouterClub />} />
            <Route path="/AfficheUsers" element={<AfficheUsers />} />
            <Route path="/AjouteAdmin" element={<AjouteAdmin />} />
            <Route path="/AfficheAdmins" element={<AfficheAdmins />} />
            <Route path="/AfficherShops" element={<AfficherShops />} />
            <Route path="/owner" element={<OwnerDashboar />} />
            <Route path="/evenementuser" element={<AfficheEvenementUser />} />
            <Route path="/eventuser" element={<Eventuser />} />
            <Route path="/conversations/:conversationId" element={<Conversation />} />
            <Route path="/my-conversations" element={<MyConversations />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/details/:id" element={<DetailsReservations />} />

            

          </Routes>

        </Router>
      </CartProvider>
    </>
  )
}

export default App
