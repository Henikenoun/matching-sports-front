import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaSpinner } from 'react-icons/fa'; // Importation des icônes
import AjouterClub from './AjouterClub'; // Importation du composant d'ajout de club
import ConfirmationModal from '../ConfirmationModal'; // Importation du modal de confirmation
import { Button, Modal, Form } from 'react-bootstrap'; // Importation des composants nécessaires de react-bootstrap

import './ModalAjout.css';

const AfficheClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(4); // Nombre d'éléments par page
    const [selectedCity, setSelectedCity] = useState(''); // Filtre par ville
    const [isModalOpen, setIsModalOpen] = useState(false); // Contrôle l'état du modal
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // Modal de confirmation
    const [clubToDelete, setClubToDelete] = useState(null); // Le club à supprimer
    const [isLoading, setIsLoading] = useState(false); // État de chargement
    const [showAddShopModal, setShowAddShopModal] = useState(false); // État pour contrôler l'affichage du modal d'ajout de shop
    const [selectedClubId, setSelectedClubId] = useState(''); // État pour stocker l'ID du club sélectionné
    const [shopName, setShopName] = useState(''); // État pour stocker le nom du shop
    const [shopDesc, setShopDesc] = useState(''); // État pour stocker la description du shop
    const [useUrl, setUseUrl] = useState(false); // État pour contrôler l'affichage de l'input URL
    const [shopUrl, setShopUrl] = useState(''); // État pour stocker l'URL du shop

    const fetchClubs = async () => {
        setIsLoading(true); // Début du chargement
        try {
            const response = await axios.get('http://localhost:8000/api/clubs');
            setClubs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des clubs', error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    // Fonction pour gérer la suppression du club
    const deleteClub = async () => {
        if (!clubToDelete) return;

        try {
            await axios.delete(`http://localhost:8000/api/clubs/${clubToDelete}`);
            // Recharger la liste des clubs après suppression
            fetchClubs();
            setIsConfirmationOpen(false); // Fermer le modal de confirmation
        } catch (error) {
            console.error('Erreur lors de la suppression du club', error);
            setIsConfirmationOpen(false); // Fermer le modal même en cas d'erreur
        }
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    const filteredClubs = selectedCity
        ? clubs.filter(club => club.ville.toLowerCase().includes(selectedCity.toLowerCase()))
        : clubs;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClubs = filteredClubs.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredClubs.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Fonction pour ouvrir le modal de confirmation avant la suppression
    const handleDeleteClick = (clubId) => {
        setClubToDelete(clubId); // Stocker l'ID du club à supprimer
        setIsConfirmationOpen(true); // Ouvrir le modal de confirmation
    };

    const handleAddShop = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = useUrl
                ? { name: shopName, desc: shopDesc, url: shopUrl }
                : { name: shopName, desc: shopDesc, club_id: selectedClubId };
            await axios.post('http://127.0.0.1:8000/api/shops', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowAddShopModal(false);
            fetchClubs();
        } catch (error) {
            console.error("Erreur lors de l'ajout du shop", error);
        }
    };

    const clubsWithoutShop = clubs.filter(club => !club.shop); // Filtrer les clubs sans shop

    return (
        <div className="report-container">
           <div className="report-header">
    <h1 className="recent-Articles">Clubs</h1>
    <div className="filter-container">
        <select
            onChange={(e) => setSelectedCity(e.target.value)} 
            value={selectedCity} 
            className="filter-select"
        >
            <option value="">Filtrage par ville</option>
            {clubs
                .map(club => club.ville)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                ))}
        </select>

        {/* Adding some space between the filter and the button */}
        <button onClick={toggleModal} className="add-club-btn">
            Ajouter un club
        </button>
        <button onClick={() => setShowAddShopModal(true)} className="add-shop-btn">
            Ajouter un shop
        </button>
    </div>
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
                                    <th>Ville</th>
                                    <th>Adresse</th>
                                    <th>Nb Terrain</th>
                                    <th>Latitude</th>
                                    <th>Actions</th> {/* Nouvelle colonne pour les actions */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentClubs.map((club, idx) => (
                                    <tr key={idx}>
                                        <td>{club.nom}</td>
                                        <td>{club.ville}</td>
                                        <td>{club.adresse}</td>
                                        <td>{club.nbTerrain}</td>
                                        <td>{club.latitude}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleDeleteClick(club.id)} // Afficher le modal de confirmation
                                                className="delete-btn"
                                            >
                                                <FaTrash size={20} color="red" />
                                            </button>
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

            {/* Modal de confirmation */}
            <ConfirmationModal 
                isOpen={isConfirmationOpen}
                onClose={() => setIsConfirmationOpen(false)}
                onConfirm={deleteClub}
            />

            {/* Modal Ajouter Club */}
            <AjouterClub 
                isOpen={isModalOpen} 
                toggleModal={toggleModal} 
                fetchClubs={fetchClubs} 
            />

            {/* Modal Ajouter Shop */}
            <Modal show={showAddShopModal} onHide={() => setShowAddShopModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un Shop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddShop}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom du Shop</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom du shop"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Entrez la description du shop"
                                value={shopDesc}
                                onChange={(e) => setShopDesc(e.target.value)}
                            />
                        </Form.Group>
                        {useUrl ? (
                            <Form.Group className="mb-3">
                                <Form.Label>URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Entrez l'URL du shop"
                                    value={shopUrl}
                                    onChange={(e) => setShopUrl(e.target.value)}
                                />
                            </Form.Group>
                        ) : (
                            <Form.Group className="mb-3">
                                <Form.Label>Club</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedClubId}
                                    onChange={(e) => setSelectedClubId(e.target.value)}
                                >
                                    <option value="">Sélectionnez un club</option>
                                    {clubsWithoutShop.map((club) => (
                                        <option key={club.id} value={club.id}>{club.nom}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        <Button variant="secondary" onClick={() => setUseUrl(!useUrl)}>
                            {useUrl ? 'Affecter à un club' : 'Utiliser une URL'}
                        </Button>
                        <Button variant="success" type="submit" className="mt-2">
                            Ajouter
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AfficheClubs;