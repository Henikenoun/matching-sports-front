import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pag.css';

const AfficheReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [terrains, setTerrains] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(6); // Nombre d'éléments par page
    const [selectedType, setSelectedType] = useState(''); // Filtre par type de terrain

    // Fonction pour récupérer les réservations
    const fetchReservations = async () => {
        try {
            const response = await axios.get('https://localhost:7050/api/Reservation');
            setReservations(response.data); // Stocke toutes les réservations
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations', error);
        }
    };

    // Fonction pour récupérer les terrains
    const fetchTerrains = async () => {
        try {
            const response = await axios.get('https://localhost:7050/api/Terrain');
            setTerrains(response.data); // Stocke tous les terrains
        } catch (error) {
            console.error('Erreur lors de la récupération des terrains', error);
        }
    };

    // Utilisation de useEffect pour récupérer les données au montage du composant
    useEffect(() => {
        fetchTerrains();
        fetchReservations();
    }, []);

    // Fonction pour filtrer les réservations par type de terrain
    const getFilteredReservations = () => {
        if (!selectedType) return reservations; // Retourne toutes les réservations si aucun filtre n'est sélectionné
        const filteredTerrainIds = terrains
            .filter(terrain => terrain.type === selectedType)
            .map(terrain => terrain.id); // IDs des terrains correspondants au type sélectionné
        return reservations.filter(reservation => filteredTerrainIds.includes(reservation.terrainId));
    };

    // Fonction pour obtenir le nom du terrain en fonction de l'ID
    const getTerrainName = (terrainId) => {
        const terrain = terrains.find(t => t.id === terrainId);
        return terrain ? terrain.nom : 'Terrain inconnu';
    };

    // Fonction pour formater une date en "DD/MM/YYYY HH:MM"
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Logique pour calculer les réservations affichées selon la page
    const filteredReservations = getFilteredReservations();

    // Trier les réservations par date de début
    const sortedReservations = filteredReservations.sort((a, b) => {
        const dateA = new Date(a.dateDebut);
        const dateB = new Date(b.dateDebut);
        return dateA - dateB; // Tri croissant de la date de début
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = sortedReservations.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer la page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcul du nombre de pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedReservations.length / itemsPerPage); i++) {
        pageNumbers.push(i);
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
                    <option value="">Tous</option>
                    <option value="Football">Football</option>
                    <option value="Tennis">Tennis</option>
                </select>
            </div>

            <div className="report-body">
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Terrain</th>
                            <th>Date Réservation</th>
                            <th>Date Début</th>
                            <th>Date Fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReservations.map((reservation, idx) => (
                            <tr key={idx}>
                                <td>{reservation.client ? `${reservation.client.nom} ${reservation.client.prenom}` : 'Client inconnu'}</td>
                                <td>{getTerrainName(reservation.terrainId)}</td>
                                <td>{formatDate(reservation.dateReservation)}</td>
                                <td>{formatDate(reservation.dateDebut)}</td>
                                <td>{formatDate(reservation.dateFin)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-container">
                    {pageNumbers.map(number => (
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
