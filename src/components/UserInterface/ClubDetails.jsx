import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import './ClubDetails.css';

// Importation des icônes depuis react-icons
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFootballBall } from 'react-icons/fa';

const ClubDetails = () => {
    const { clubId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialSport = searchParams.get('sport');
    const [club, setClub] = useState(null);
    const [terrains, setTerrains] = useState([]);
    const [filteredTerrains, setFilteredTerrains] = useState([]);
    const [selectedType, setSelectedType] = useState(initialSport || '');

    useEffect(() => {
        axios.get(`http://localhost:8000/api/clubs/${clubId}`)
            .then(response => {
                setClub(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the club details!', error);
            });

        axios.get(`http://localhost:8000/api/clubs/${clubId}/terrains`)
            .then(response => {
                setTerrains(response.data);
                if (initialSport) {
                    const filtered = response.data.filter(terrain => terrain.type.toLowerCase() === initialSport.toLowerCase());
                    setFilteredTerrains(filtered);
                } else {
                    setFilteredTerrains(response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the terrains!', error);
            });
    }, [clubId, initialSport]);

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        if (type) {
            const filtered = terrains.filter(terrain => terrain.type.toLowerCase() === type.toLowerCase());
            setFilteredTerrains(filtered);
        } else {
            setFilteredTerrains(terrains);
        }
    };

    const handleReservationClick = (terrainId) => {
        navigate(`/reservation?clubId=${clubId}&terrainId=${terrainId}`);
    };

    if (!club) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Menu />
            <div className="club-details-portfolio">
                <header className="club-header">
                    <div className="club-header-content">
                        <h1>{club.nom}</h1>
                    </div>
                </header>

                <div className="club-info">
                    <div className="left-column">
                        <p><FaMapMarkerAlt /> <strong>Ville:</strong> {club.ville}</p>
                        <p><FaPhoneAlt /> <strong>Numéro de téléphone:</strong> {club.numTel}</p>
                    </div>
                    <div className="right-column">
                        <p><FaEnvelope /> <strong>Email:</strong> {club.email}</p>
                        <p><FaFootballBall /> <strong>Nombre de terrains:</strong> {club.nbTerrain}</p>
                    </div>
                </div>

                <section className="terrains-section">
                    <h2>Terrains</h2>
                    <div className="filter-container">
                        <label htmlFor="terrain-type">Filtrer par type:</label>
                        <select id="terrain-type" value={selectedType} onChange={handleTypeChange}>
                            <option value="">Tous</option>
                            {Array.from(new Set(terrains.map(terrain => terrain.type))).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="terrains-grid">
                        {filteredTerrains.map(terrain => (
                            <div className="terrain-card" key={terrain.id}>
                                <img
                                    src={terrain.image || 'https://via.placeholder.com/150'}
                                    alt={terrain.nom}
                                    className="terrain-image"
                                />
                                <div className="terrain-details">
                                    <h3>{terrain.nom}</h3>
                                    <p><strong>Type:</strong> {terrain.type}</p>
                                    <p><strong>Surface:</strong> {terrain.surface}</p>
                                    <button onClick={() => handleReservationClick(terrain.id)}>Réserver</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ClubDetails;