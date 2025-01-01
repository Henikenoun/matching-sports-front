import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AffichageProfil.css'; // Reuse the same CSS for styling
import Menu from '../Menu/Menu';
import axios from 'axios';

function AffichageProfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    surname: '',
    email: '',
    date_of_birth: '',
    city: '',
    phone_number: '',
    photo: '',
    availability: false,
    transport: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserProfile({
        name: user.name || 'Nom non disponible',
        surname: user.surname || 'Prénom non disponible',
        email: user.email || 'Email non disponible',
        date_of_birth: user.date_of_birth || 'Date de naissance non disponible',
        city: user.city || 'Ville non disponible',
        phone_number: user.phone_number || 'Numéro de téléphone non disponible',
        photo: user.photo || 'Photo non disponible',
        availability: user.availability || false,
        transport: user.transport || false,
      });
    }
  }, []);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserProfile({ ...userProfile, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSaveChanges = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;  // Récupérer l'ID de l'utilisateur à partir de `id`
    
    if (!userId) {
      setError('ID utilisateur manquant.');
      return;
    }

    const updatedUser = {};
    for (const key in userProfile) {
      if (userProfile[key] !== user[key]) {
        updatedUser[key] = userProfile[key];
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/edit-profile/${userId}`,
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
          ...updatedUser,
        }));

        setSuccessMessage('Le profil a été mis à jour avec succès!');
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
      <div className="register-container">
        <div className="register-card">
          <h2>Mon Profil</h2>
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <form onSubmit={handleSaveChanges}>
            <div className="form-row">
              <div className="form-column">
                <div className="input-group">
                  <label htmlFor="name">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Votre nom"
                    value={userProfile.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="surname">Prénom</label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    placeholder="Votre prénom"
                    value={userProfile.surname}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Votre email"
                    value={userProfile.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="date_of_birth">Date de naissance</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    placeholder="Votre date de naissance"
                    value={userProfile.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="city">Ville</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Votre ville"
                    value={userProfile.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="input-group">
                  <label htmlFor="phone_number">Numéro de téléphone</label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    placeholder="Votre numéro de téléphone"
                    value={userProfile.phone_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="photo">Photo</label>
                  <input
                    type="text"
                    id="photo"
                    name="photo"
                    placeholder="Votre photo"
                    value={userProfile.photo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="availability">Disponibilité</label>
                  <input
                    type="checkbox"
                    id="availability"
                    name="availability"
                    checked={userProfile.availability}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="transport">Transport</label>
                  <input
                    type="checkbox"
                    id="transport"
                    name="transport"
                    checked={userProfile.transport}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="register-btn">
              {isEditing ? 'Enregistrer' : 'Modifier Profil'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AffichageProfil;