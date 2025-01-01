import React, { useState } from 'react';
import axios from 'axios'; // Importation d'axios
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate
import './Login.css'; // Assurez-vous de créer ce fichier CSS pour le style
import Menu from '../Menu/Menu';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook de navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/users/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // Stock the token and user details in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setIsLoading(false);

        // Redirection based on user role
        const userRole = response.data.user.role;
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'owner') {
          navigate('/owner');
        } else {
          navigate('/');
        }
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
        setIsLoading(false);
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
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;