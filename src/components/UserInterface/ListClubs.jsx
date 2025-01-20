import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import './ListClubs.css';

const ListClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/clubs')
            .then(response => {
                setClubs(response.data);
                setFilteredClubs(response.data); // Initialize filteredClubs with all clubs
            })
            .catch(error => {
                console.error('There was an error fetching the clubs!', error);
            });
    }, []);
    

    const staticImage = 'https://img.freepik.com/free-photo/football-trainer-teaching-his-pupils_23-2149707985.jpg?ga=GA1.1.1024326678.1705530980';

    // Filter clubs based on search term
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = clubs.filter(club =>
            club.ville.toLowerCase().includes(value)
        );
        setFilteredClubs(filtered);
    };

    const handleCardClick = (clubId) => {
        navigate(`/clubs/${clubId}`);
    };

    return (
        <>
            <Menu />
            <div className="clubs-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Rechercher par ville..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="clubs-grid">
                    {filteredClubs.map(club => (
                        <div className="club-card" key={club.id} onClick={() => handleCardClick(club.id)}>
                            <img
                                src={staticImage}
                                alt="Football trainer teaching his pupils"
                                className="club-image"
                            />
                            <div className="club-details">
                                <h3>{club.nom}</h3>
                                <p><strong>Ville:</strong> {club.ville}</p>
                                <p><strong>Numéro de téléphone:</strong> {club.numTel}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ListClubs;