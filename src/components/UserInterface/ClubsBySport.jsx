import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import './ClubsBySport.css';

const ClubsBySport = () => {
  const [clubs, setClubs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sport = searchParams.get('sport');

  useEffect(() => {
    axios.get('http://localhost:8000/api/clubs')
      .then(response => {
        const filtered = response.data.filter(club =>
          club.terrains && club.terrains.some(terrain => terrain.type.toLowerCase() === sport.toLowerCase())
        );
        setClubs(filtered);
      })
      .catch(error => {
        console.error('There was an error fetching the clubs!', error);
      });
  }, [sport]);

  const handleClubClick = (clubId) => {
    navigate(`/clubs/${clubId}?sport=${sport}`);
  };

  return (
    <div className="clubs-by-sport">
      <Menu />
      <div className="clubs-container">
        <h2 className="section-title">Clubs avec terrains de {sport}</h2>
        <div className="clubs-grid">
          {clubs.map(club => (
            <div className="club-card" key={club.id} onClick={() => handleClubClick(club.id)}>
              <h3>{club.nom}</h3>
              <p><strong>Ville:</strong> {club.ville}</p>
              <p><strong>Numéro de téléphone:</strong> {club.numTel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsBySport;