import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../Menu/Menu';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Réinitialiser l'erreur avant une nouvelle tentative

    if (!formData.email || !formData.password) {
      setError('Tous les champs doivent être remplis');
      setIsLoading(false);
      return;
    }

    try {
      // Envoi des données à l'API pour se connecter
      const response = await axios.post('https://localhost:7050/api/Account/login', {
        email: formData.email,
        motDePasse: formData.password,
      });

      if (response.status === 200) {
        const { token, idClient, nom, prenom, email, role, nbReservations, typesGym } = response.data;

        // Stockage des données dans localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ idClient, nom, prenom, email, role, nbReservations, typesGym }));

        // Affichage du toast de succès
        toast.success('Connexion réussie !', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
        });

        // Redirection en fonction du rôle de l'utilisateur
        if (role === 'admin') {
          setTimeout(() => {
            navigate('/admin'); // Rediriger vers la page admin si le rôle est admin
          }, 300);
        } else {
          setTimeout(() => {
            navigate('/'); // Rediriger vers la page d'accueil sinon
          }, 300);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setError('Identifiants incorrects. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Menu />
      <div className="login-container">
        <div className="login-card">
          <h2>Se connecter</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
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
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="signup-redirect">
              <p>
                Pas encore de compte ? <a href="/register">S'inscrire</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
