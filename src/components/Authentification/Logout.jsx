import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
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
      navigate('/login');
    }, 3000); // Redirection après 3 secondes (temps que le toast reste visible)
  };

  return (
    <div>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Logout;
