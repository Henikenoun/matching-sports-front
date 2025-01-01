import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin/Pag.css';

const ReservationUser = () => {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/reservation');
            const userReservations = response.data.filter(reservation => reservation.User_Reserve === userId);
            setReservations(userReservations);
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = reservations.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(reservations.length / itemsPerPage); i++) {
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
                <p><strong>Participants:</strong> {JSON.parse(selectedReservation.Participants).join(', ')}</p>
                <button onClick={() => setSelectedReservation(null)}>Retour</button>
            </div>
        );
    }

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 className="recent-Articles">Mes Réservations</h1>
            </div>

            <div className="report-body">
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Terrain</th>
                            <th>Date Réservation</th>
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
                                <td>{reservation.terrain.nom}</td>
                                <td>{formatDate(reservation.Date_Reservation)}</td>
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

export default ReservationUser;