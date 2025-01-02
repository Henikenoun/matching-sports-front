import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AfficheDemandeP = () => {
    const [demandes, setDemandes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
    const [loading, setLoading] = useState(false);

    // Fonction pour récupérer les demandes d'un utilisateur connecté
    const fetchUserDemandes = async (page = 1) => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                const response = await axios.get(`http://localhost:8000/api/demandes/user/${user.id}`);
                const demandesData = response.data;

                setDemandes(demandesData); // Les demandes de la page actuelle
                setCurrentPage(page); // Page actuelle
                setTotalPages(Math.ceil(demandesData.length / 10)); // Nombre total de pages
            } else {
                console.error('Aucun utilisateur trouvé dans localStorage');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes', error);
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial des données
    useEffect(() => {
        fetchUserDemandes();
    }, []);

    // Fonction pour gérer la pagination
    const handlePageChange = (page) => {
        fetchUserDemandes(page);
    };

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 className="recent-Articles">Demandes</h1>
            </div>

            {loading ? (
                <div className="text-center">Chargement...</div>
            ) : (
                <>
                    <div className="report-body">
                        <table className="reservation-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Article</th>
                                    <th>Quantité</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demandes.slice((currentPage - 1) * 10, currentPage * 10).map((demande, idx) => (
                                    <tr key={idx}>
                                        <td>{demande.id}</td>
                                        <td>{demande.article ? demande.article.name : 'Article introuvable'}</td>
                                        <td>{demande.quantity}</td>
                                        <td>{demande.total} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="pagination-container">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AfficheDemandeP;