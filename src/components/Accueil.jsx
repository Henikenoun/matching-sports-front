import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormulaireTerrain from './FormulaireTerrain';
import FormulaireAbonnement from './FormulaireAbonnement';
import Menu from './Menu/Menu';
import './Accueil.css';
import heroImage from '../assets/Sportissimo.jpg';
// Import des images locales
import footballImg from '../assets/football.jpg';
import tennisImg from '../assets/tennis.jpg';
import gymImg from '../assets/gym1.jpg';

const sportsList = [
  { name: 'Football', image: footballImg },
  { name: 'Tennis', image: tennisImg },
  { name: 'Musculation', image: gymImg },
  // Add more sports as needed
];

const Accueil = () => {
  const [showTerrain, setShowTerrain] = useState(false);
  const [showAbonnement, setShowAbonnement] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const navigate = useNavigate();

  const servicesRef = useRef(null); // Créez une référence pour la section des services

  const handleCloseTerrain = () => setShowTerrain(false);
  const handleCloseAbonnement = () => setShowAbonnement(false);

  const handleShow = (sport) => {
    if (sport === 'Musculation') {
      setShowAbonnement(true);
    } else {
      setSelectedSport(sport);
      setShowTerrain(true);
    }
  };

  const handleScrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' }); // Fait défiler jusqu'à la section
  };

  const handleSportSelect = (sport) => {
    navigate(`/clubs-by-sport?sport=${sport}`);
  };

  return (
    <div className="app">
      <Menu />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            width: '100%',
          }}
        ></div>
        <div className="hero-content">
          <h1>Bienvenue à Sportissimo</h1>
          <p className="hero-subtitle">
            Découvrez nos terrains de football et de tennis, notre salle de musculation moderne,
            et un espace dédié aux enfants. Sportissimo est le lieu idéal pour tous.
          </p>
          <button className="cta-btn" >
            Réservez Maintenant
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" ref={servicesRef}>
        <h2 className="section-title">Découvrez Nos Activités</h2>
        <div className="service-cards">
          {sportsList.map(sport => (
            <div className="card" key={sport.name} onClick={() => handleSportSelect(sport.name)}>
              <img src={sport.image} alt={sport.name} className="card-img" />
              <div className="card-body">
                <h3>{sport.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
    

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Sportissimo - Votre club sportif préféré</p>
        <ul className="social-links">
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">Instagram</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Accueil;