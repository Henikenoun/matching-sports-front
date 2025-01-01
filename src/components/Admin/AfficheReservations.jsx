import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pag.css';

const AfficheReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const [terr, setTerr] = useState([]);
    // Fonction pour récupérer les réservations
    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/reservation');
            setReservations(response.data);
            const terrainNames = [];
            response.data.forEach((r) => {
                if (!terrainNames.includes(r.terrain.nom)) {
                    terrainNames.push(r.terrain.nom);
                }
            });
            setTerr(terrainNames);
            console.log(terrainNames);
            // Récupération des noms des utilisateurs
            const userIds = [...new Set(response.data.map((r) => r.User_Reserve))]; // Identifiants uniques
            const userResponses = await Promise.all(
                userIds.map((id) => axios.get(`http://127.0.0.1:8000/api/users/${id}`))
            );
            const names = userResponses.reduce((acc, res) => {
                acc[res.data.id] = res.data.name;
                return acc;
            }, {});
            setUserNames(names);
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations ou des utilisateurs', error);
        } finally {
            setLoading(false); // Arrêt du chargement
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const getName = (User_Reserve) => userNames[User_Reserve] || 'Nom inconnu';

    const getFilteredReservations = () => {
        if (!selectedType) return reservations;
        return reservations.filter((reservation) => reservation.terrain.nom === selectedType);
    };

    const getTerrainName = (terrain) => (terrain ? terrain.nom : 'Terrain inconnu');

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const handleDetailsClick = (reservationId) => {
        const reservation = reservations.find(r => r.id === reservationId);
        setSelectedReservation(reservation);
    
    };

    const filteredReservations = getFilteredReservations().sort((a, b) => {
        const dateA = new Date(a.Date_Reservation);
        const dateB = new Date(b.Date_Reservation);
        return dateA - dateB;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredReservations.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-circle"></div>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    if (selectedReservation) {
        return (
            <div className="report-container p-5">
                <h1>Détails de la Réservation</h1>
                <p>Nom du Terrain: {selectedReservation.terrain.nom}</p>
                <p>Date de reservation: {formatDate(selectedReservation.Date_Reservation)}</p>
                <p>reservation sera le : {formatDate(selectedReservation.Date_TempsReel)}</p>
                <p>Nombre de Places: {selectedReservation.Nb_Place}</p>
                <p>Type: {selectedReservation.Type}</p>
                <p>Complet: {selectedReservation.Complet ? <span className='text-success'>Oui</span> : <span className='text-danger'>Non</span>}</p>
                <p>Places Disponibles: {selectedReservation.terrain.capacite - selectedReservation.Nb_Place}</p>
                <p>Frais de Location: {selectedReservation.terrain.fraisLocation}</p>
                <p>Payé: {selectedReservation.ispaye ? <span className='text-success'>Oui</span> : <span className='text-danger'>Non</span>}</p>
                <p><strong>Participants:</strong> {JSON.parse(selectedReservation.Participants).map(id => getName(id)).join(', ')}</p>
                <button onClick={() => setSelectedReservation(null)}>Retour</button>
            </div>
        );
    }

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 className="recent-Articles">Réservations</h1>
                <select
                    onChange={(e) => setSelectedType(e.target.value)}
                    value={selectedType}
                    className="filter-select"
                >
                    <option value="">tous</option>
                    {terr.map((terrain, index) => (
                        <option key={index} value={terrain}>{terrain}</option>
                    ))}
                </select>
            </div>

            <div className="report-body">
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Terrain</th>
                            <th>Date Réservation</th>
                            {/* <th>Participants</th> */}
                            <th>Type</th>
                            <th>Complet</th>
                            <th>Places Disponibles</th>
                            <th>Frais de Location</th>
                            <th>Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReservations.map((reservation, idx) => (
                            <tr key={idx}>
                                <td>{getName(reservation.User_Reserve)}</td>
                                <td>{getTerrainName(reservation.terrain)}</td>
                                <td>{formatDate(reservation.Date_Reservation)}</td>
                                {/* <td>{reservation.Participants}</td> */}
                                <td>{reservation.Type}</td>
                                <td>{reservation.Complet ? 'Oui' : 'Non'}</td>
                                <td>{reservation.terrain.capacite - reservation.Nb_Place}</td>
                                <td>{reservation.ispaye ? 'Payé' : 'Non payé'}</td>
                                <td>
                                    <button onClick={() => handleDetailsClick(reservation.id)}>Détails</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination-container">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`page-btn ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AfficheReservations;