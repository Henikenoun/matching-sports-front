import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AffichageProfil.css'; // Assurez-vous de créer ce fichier CSS pour le style
import Menu from '../Menu/Menu';

function AffichageProfil() {
  const [isEditing, setIsEditing] = useState(false); // Ajout d'un état pour gérer le mode édition
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    membership: 'Premium',
  });

  const navigate = useNavigate();

  // Fonction pour basculer entre le mode affichage et édition
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Fonction pour gérer la modification des informations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  return (
    <>
      <Menu />
      <div className="profile-container">
        <div className="profile-card">
          <h2>Mon Profil</h2>
          <div className="profile-info">
            {isEditing ? (
              <>
                <div className="profile-item">
                  <label htmlFor="name"><strong>Nom :</strong></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userProfile.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="profile-item">
                  <label htmlFor="email"><strong>Email :</strong></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="profile-item">
                  <label htmlFor="phone"><strong>Téléphone :</strong></label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={userProfile.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="profile-item">
                  <label htmlFor="membership"><strong>Abonnement :</strong></label>
                  <input
                    type="text"
                    id="membership"
                    name="membership"
                    value={userProfile.membership}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="profile-item">
                  <strong>Nom :</strong> <span>{userProfile.name}</span>
                </div>
                <div className="profile-item">
                  <strong>Email :</strong> <span>{userProfile.email}</span>
                </div>
                <div className="profile-item">
                  <strong>Téléphone :</strong> <span>{userProfile.phone}</span>
                </div>
                <div className="profile-item">
                  <strong>Abonnement :</strong> <span>{userProfile.membership}</span>
                </div>
              </>
            )}
          </div>

          {/* Boutons pour modifier ou enregistrer */}
          <button className="edit-btn" onClick={toggleEditMode}>
            {isEditing ? 'Enregistrer' : 'Modifier Profil'}
          </button>
        </div>
      </div>
    </>
  );
}

export default AffichageProfil;
