import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa'; // Importation des icônes
import './ModalAjout.css';

const AfficheUsers = () => {
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(6); // Nombre d'éléments par page
    const [selectedCity, setSelectedCity] = useState(''); // Filtre par ville
    const [isLoading, setIsLoading] = useState(false); // État de chargement

    const fetchUsers = async () => {
        setIsLoading(true); // Début du chargement
        try {
            const response = await axios.get('http://localhost:8000/api/users/getAll');
            // Filtrer uniquement les utilisateurs avec rôle 'user'
            const usersOnly = response.data.filter(user => user.role === 'user');
            setUsers(usersOnly);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Appliquer un filtre par ville si un filtre est sélectionné
    const filteredUsers = selectedCity
        ? users.filter(user => user.city.toLowerCase().includes(selectedCity.toLowerCase()))
        : users;

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 className="recent-Articles">Utilisateurs</h1>
                <select
                    onChange={(e) => setSelectedCity(e.target.value)}
                    value={selectedCity}
                    className="filter-select"
                >
                    <option value="">Filtrage par ville</option>
                    {users
                        .map(user => user.city)
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .map((city, idx) => (
                            <option key={idx} value={city}>{city}</option>
                        ))}
                </select>
            </div>

            <div className="report-body">
                {isLoading ? (
                    <div className="loading-container">
                        <FaSpinner className="loading-icon" size={50} />
                    </div>
                ) : (
                    <>
                        <table className="reservation-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Date de naissance</th>
                                    <th>Ville</th>
                                    <th>Photo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, idx) => (
                                    <tr key={idx}>
                                        <td>{user.name}</td>
                                        <td>{user.surname}</td>
                                        <td>{user.date_of_birth}</td>
                                        <td>{user.city}</td>
                                        <td>
                                            {user.photo ? (
                                                <img
                                                    src={user.photo}
                                                    alt="Utilisateur"
                                                    className="user-photo"
                                                />
                                            ) : (
                                                'Pas de photo'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
                    </>
                )}
            </div>
        </div>
    );
};

export default AfficheUsers;
