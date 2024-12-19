import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assurez-vous d'avoir installé react-toastify
import './Menu.css';
import logoImage from '../../assets/Logo.png'; // Chemin vers votre image

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token'); 

    // Afficher un message de succès
    toast.success('Vous êtes déconnecté avec succès!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000, // Temps avant de fermer le toast
    });

    // Rediriger vers la page de connexion après un court délai pour laisser apparaître le toast
    setTimeout(() => {
      navigate('/login'); // Redirige vers la page de connexion
    }, 3000); // Redirection après 3 secondes
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
          <li className="menu-item" onClick={() => navigate('/ReservationUser')}>
            Mes Réservations
          </li>
          <li className="menu-item" onClick={() => navigate('/AbonnementUser')}>
            Mes Abonnements
          </li>
          <li className="menu-item" onClick={() => navigate('/AffichageProfil')}>
            Profil
          </li>
          <li className="menu-item" onClick={() => navigate('/contact')}>
            Contact
          </li>
          {/* Ajouter les liens pour l'inscription et la connexion */}
          <li className="menu-item" onClick={() => navigate('/Register')}>
            S'inscrire
          </li>
          <li className="menu-item" onClick={() => navigate('/login')}>
            Se connecter
          </li>
          {/* Bouton de déconnexion */}
          <li className="menu-item" onClick={handleLogout}>
            Se déconnecter
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Menu;
