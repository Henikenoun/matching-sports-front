import React, { useState } from 'react';
import axios from 'axios'; // Importation d'axios
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate
import './Register.css'; // Assurez-vous de créer ce fichier CSS pour le style
import Menu from '../Menu/Menu';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook de navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Tous les champs doivent être remplis');
      return;
    }

    setError('');
    // Création du body de la requête
    const requestData = {
      email: formData.email,
      nom: formData.lastName,
      prenom: formData.firstName,
      motDePasse: formData.password,
    };

    try {
      const response = await axios.post('https://localhost:7050/api/Account/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Inscription réussie !');
        console.log(response.data);
        // Redirection vers la page d'accueil après une inscription réussie
        navigate('/');
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
          <div className="input-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Votre nom"
              value={formData.lastName}
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
