import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assurez-vous que cette ligne est correcte
import 'react-toastify/dist/ReactToastify.css'; // N'oubliez pas d'importer le CSS
import './Menu.css';
import logoImage from '../../assets/Logo.png'; // Chemin vers votre image
import { FaUserCircle } from 'react-icons/fa'; // Importation de l'icône utilisateur
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useShoppingCart } from 'use-shopping-cart';

const Menu = () => {
  const navigate = useNavigate();
  const { cartCount } = useShoppingCart();
  const user = JSON.parse(localStorage.getItem('user'));
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    // Supprimer le token et les informations utilisateur du localStorage


    axios.post('http://localhost:8000/api/users/logout')
      .then(response => {
        console.log('Logout successful:', response.data);
      })
      .catch(error => {
        console.error('There was an error logging out:', error);
      });
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Afficher un message de succès
    toast.success('Vous êtes déconnecté avec succès!', {
      autoClose: 3000, // Temps avant de fermer le toast
    });

    // Rediriger vers la page de connexion après un court délai pour laisser apparaître le toast
    setTimeout(() => {
      navigate('/login'); // Redirige vers la page de connexion
    }, 3000); // Redirection après 3 secondes
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="menu-header">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logoImage} alt="Sportissimo Logo" />
      </div>
      <nav>
        <ul className="menu-links">
          <li className="menu-item" onClick={() => navigate('/')}>
            Accueil
          </li>
          <li className="menu-item" onClick={() => navigate('/clubs')}>
            Clubs
          </li>
          <li className="menu-item" onClick={() => navigate('/ReservationUser')}>
            Mes Réservations
          </li>
          <li className="menu-item" onClick={() => navigate('/AfficheAbonnementUser')}>
            Mes Abonnements
          </li>
          {user ? (
            <>
              <li className="menu-item" onClick={toggleDropdown}>
                <FaUserCircle size={24} /> {user.name}
                {dropdownVisible && (
                  <ul className="profile-dropdown">
                    <li onClick={() => navigate('/AffichageProfil')}>Profil</li>
                    <li onClick={handleLogout}>Se déconnecter</li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li className="menu-item" onClick={() => navigate('/Register')}>
                S'inscrire
              </li>
              <li className="menu-item" onClick={() => navigate('/login')}>
                Se connecter
              </li>
            </>
          )}
          <li className="menu-item" onClick={() => navigate('/cart')}>
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Menu;