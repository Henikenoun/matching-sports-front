import React, { useState } from 'react';
import axios from 'axios'; // Importation d'axios
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate
import './Register.css'; // Assurez-vous de créer ce fichier CSS pour le style
import Menu from '../Menu/Menu';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    password_confirmation: '',
    date_of_birth: '',
    city: '',
    phone_number: '',
    photo: '',
    availability: false,
    transport: false,
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook de navigation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.password_confirmation) {
      setError('Tous les champs doivent être remplis');
      return;
    }

    setError('');
    // Création du body de la requête
    const requestData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      role: 'user',
      date_of_birth: formData.date_of_birth,
      city: formData.city,
      phone_number: formData.phone_number,
      photo: formData.photo,
      availability: formData.availability,
      transport: formData.transport,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/users/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Inscription réussie !');
        console.log(response.data);
        // Redirection vers la page d'accueil après une inscription réussie
        navigate('/login');
      }
    } catch (error) {
      // Si une erreur se produit lors de l'appel API
      if (error.response) {
        // Erreur venant du serveur
        setError(error.response.data.message || 'Une erreur s\'est produite');
      } else {
        // Erreur de connexion réseau
        setError('Impossible de se connecter au serveur');
      }
      console.error(error);
    }
  };

  return (
    <> <Menu/>
    <div className="register-container">
      <div className="register-card">
        <h2>S'inscrire</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <div className="input-group">
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.surname}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="input-group">
                <label htmlFor="date_of_birth">Date de naissance</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  placeholder="Votre date de naissance"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Votre ville"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone_number">Numéro de téléphone</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  placeholder="Votre numéro de téléphone"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="photo">Photo</label>
                <input
                  type="text"
                  id="photo"
                  name="photo"
                  placeholder="Votre photo"
                  value={formData.photo}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="availability">Disponibilité</label>
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="transport">Transport</label>
                <input
                  type="checkbox"
                  id="transport"
                  name="transport"
                  checked={formData.transport}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn">
            S'inscrire
          </button>

          <div className="login-redirect">
            <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
          </div>
        </form>
      </div>
    </div></>
  );
};

export default Register;