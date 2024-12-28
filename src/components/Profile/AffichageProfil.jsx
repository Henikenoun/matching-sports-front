import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AffichageProfil.css';
import Menu from '../Menu/Menu';
import axios from 'axios';

function AffichageProfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',    
    prenom: '',  
    email: '',   
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserProfile({
        name: user.nom || 'Nom non disponible',
        prenom: user.prenom || 'Prénom non disponible', 
        email: user.email || 'Email non disponible',
      });
    }
  }, []);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSaveChanges = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.idClient;  // Récupérer l'ID de l'utilisateur à partir de `idClient`
    
    if (!userId) {
      setError('ID utilisateur manquant.');
      return;
    }

    const updatedUser = {
      nom: userProfile.name,  // Seulement le nom est mis à jour
    };

    try {
      const response = await axios.put(
        `https://localhost:7050/api/Account/${userId}`,
        updatedUser,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          nom: updatedUser.nom,
        }));

        setSuccessMessage('Le nom du profil a été mis à jour avec succès!');
        setError('');
        setIsEditing(false);
      } else {
        setError(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Une erreur est survenue lors de la mise à jour du profil.');
      setSuccessMessage('');
    }
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
                    disabled
                  />
                </div>
                <div className="profile-item">
                  <label htmlFor="prenom"><strong>Prénom :</strong></label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={userProfile.prenom}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </>
            ) : (
              <>
                <div className="profile-item">
                  <strong>Nom :</strong> <span>{userProfile.name}</span>
                </div>
                <div className="profile-item">
                  <strong>Prénom :</strong> <span>{userProfile.prenom}</span>
                </div>
                <div className="profile-item">
                  <strong>Email :</strong> <span>{userProfile.email}</span>
                </div>
              </>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button className="edit-btn" onClick={isEditing ? handleSaveChanges : toggleEditMode}>
            {isEditing ? 'Enregistrer' : 'Modifier Profil'}
          </button>
        </div>
      </div>
    </>
  );
}

export default AffichageProfil;
