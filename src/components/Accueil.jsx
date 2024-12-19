import React, { useState, useRef } from 'react';
import FormulaireTerrain from './FormulaireTerrain';
import FormulaireAbonnement from './FormulaireAbonnement';
import Menu from './Menu/Menu';
import './Accueil.css';
import heroImage from '../assets/Sportissimo.jpg';
// Import des images locales
import footballImg from '../assets/football.jpg';
import tennisImg from '../assets/tennis.jpg';
import gymImg from '../assets/gym1.jpg';

const Accueil = () => {
  const [showTerrain, setShowTerrain] = useState(false);
  const [showAbonnement, setShowAbonnement] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");

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
          <button className="cta-btn" onClick={handleScrollToServices}>
            Réservez Maintenant
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" ref={servicesRef}>
        <h2 className="section-title">Découvrez Nos Activités</h2>
        <div className="service-cards">
          <div className="card" onClick={() => handleShow('Football')}>
            <img src={footballImg} alt="Football" className="card-img" />
            <div className="card-body">
              <h3>Football</h3>
              <p>Réservez nos terrains pour des matchs entre amis ou des tournois.</p>
            </div>
          </div>
          <div className="card" onClick={() => handleShow('Tennis')}>
            <img src={tennisImg} alt="Tennis" className="card-img" />
            <div className="card-body">
              <h3>Tennis</h3>
              <p>Jouez sur des courts modernes avec tout l'équipement nécessaire.</p>
            </div>
          </div>
          <div className="card" onClick={() => handleShow('Musculation')}>
            <img src={gymImg} alt="Musculation" className="card-img" />
            <div className="card-body">
              <h3>Salle de Sport</h3>
              <p>
                Accédez à nos équipements dernier cri en souscrivant un abonnement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <FormulaireTerrain
        show={showTerrain}
        handleClose={handleCloseTerrain}
        selectedSport={selectedSport}
      />
      <FormulaireAbonnement
        show={showAbonnement}
        handleClose={handleCloseAbonnement}
      />

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
