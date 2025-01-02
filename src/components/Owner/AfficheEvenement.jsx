import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const AfficheEvenement = () => {
    const [evenements, setEvenements] = useState([]);
    const [terrains, setTerrains] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(6); // Nombre d'éléments par page
    const [selectedType, setSelectedType] = useState(''); // Filtre par type d'événement
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to manage delete modal visibility
    const [deleteReason, setDeleteReason] = useState(''); // State to store delete reason
    const [eventToDelete, setEventToDelete] = useState(null); // State to store event to delete
    const [newEvenement, setNewEvenement] = useState({
        nom: '',
        type: '',
        nombreMax: '',
        date: '',
        description: '',
        prixUnitaire: '',
        responsable: '',
        club_id: '',
        terrain_id: '',
        nbActuel: 0, // Default value
        photo: '', // Default value
        participant: [], // Default value
        raison: null // Default value
    });
    const [clubName, setClubName] = useState(''); // Pour stocker le nom du club de l'utilisateur

    // Fonction pour récupérer les événements
    const fetchEvenements = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('User from localStorage:', user); // Log user data
            const response = await axios.get(`http://localhost:8000/api/evenements/responsable/${user.id}`);
            setEvenements(response.data); // Stocke tous les événements
        } catch (error) {
            console.error('Erreur lors de la récupération des événements', error);
        }
    };

    // Fonction pour récupérer le club de l'utilisateur
    const fetchUserClub = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('User from localStorage:', user); // Log user data
            if (user && user.id) {
                const response = await axios.get(`http://localhost:8000/api/users/${user.id}`);
                const userData = response.data;
                console.log('User data from API:', userData); // Log user data from API
                if (userData.club) {
                    setNewEvenement((prevState) => ({ ...prevState, club_id: userData.club.id }));
                    setClubName(userData.club.nom); // Stocker le nom du club
                } else {
                    console.log('No club found for user');
                }
            } else {
                console.log('No user found in localStorage');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du club de l\'utilisateur', error);
        }
    };

    // Fonction pour récupérer les terrains
    const fetchTerrains = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/terrains');
            setTerrains(response.data); // Stocke tous les terrains
        } catch (error) {
            console.error('Erreur lors de la récupération des terrains', error);
        }
    };

    // Utilisation de useEffect pour récupérer les données au montage du composant
    useEffect(() => {
        fetchEvenements();
        fetchTerrains();
        fetchUserClub(); // Récupérer le club de l'utilisateur

        // Définir l'ID de l'utilisateur comme responsable
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setNewEvenement((prevState) => ({ ...prevState, responsable: user.id }));
        }
    }, []);

    // Filtrer les terrains en fonction du club de l'utilisateur
    const filteredTerrains = terrains.filter(terrain => terrain.club_id === newEvenement.club_id);

    // Fonction pour gérer la suppression d'un événement
    const handleDelete = async () => {
        try {
            await axios({
                method: 'delete',
                url: `http://localhost:8000/api/evenements/${eventToDelete}`,
                data: { raison: deleteReason }
            });
            fetchEvenements(); // Rafraîchir la liste des événements après suppression
            setShowDeleteModal(false); // Fermer le modal de suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
        }
    };

    // Filtrage des événements selon le type sélectionné
    const filteredEvenements = selectedType
        ? evenements.filter(evenement => evenement.type.toLowerCase().includes(selectedType.toLowerCase()))
        : evenements;

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvenements = filteredEvenements.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer la page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcul du nombre de pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredEvenements.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Handle form input change
    const handleChange = (e) => {
        setNewEvenement({ ...newEvenement, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting event:', newEvenement); // Log the data being sent
        try {
            await axios.post('http://localhost:8000/api/evenements', newEvenement);
            fetchEvenements(); // Refresh the list of events
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'événement:', error);
        }
    };

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 className="recent-Articles">Événements</h1>
                <select
                    onChange={(e) => setSelectedType(e.target.value)}
                    value={selectedType}
                    className="filter-select"
                >
                    <option value="">Filtrage par type</option>
                    {/* Filtrer par types uniques d'événements */}
                    {evenements
                        .map(evenement => evenement.type)
                        .filter((value, index, self) => self.indexOf(value) === index) // Enlever les doublons
                        .map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                </select>
                <Button variant="primary" onClick={() => setShowModal(true)}>Ajouter un événement</Button> {/* Button to show modal */}
            </div>

            <div className="report-body">
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Nb Max</th>
                            <th>Nb Actuel</th>
                            <th>Prix</th>
                            <th>Responsable</th>
                            <th>Actions</th> {/* Nouvelle colonne pour les actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentEvenements.map((evenement, idx) => (
                            <tr key={idx}>
                                <td>{evenement.nom}</td>
                                <td>{evenement.type}</td>
                                <td>{evenement.date}</td>
                                <td>{evenement.nombreMax}</td>
                                <td>{evenement.nbActuel}</td>
                                <td>{evenement.prixUnitaire} €</td>
                                <td>{evenement.responsable?.name || 'N/A'}</td>
                                <td>
                                    <Button variant="danger" onClick={() => { setEventToDelete(evenement.id); setShowDeleteModal(true); }}>Supprimer</Button>
                                </td>
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

            {/* Modal for adding event */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un événement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="nom"
                                placeholder="Nom de l'événement"
                                value={newEvenement.nom}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={newEvenement.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un type</option>
                                <option value="Cours">Cours</option>
                                <option value="Tournoi">Tournoi</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formNombreMax">
                            <Form.Label>Nombre maximum de participants</Form.Label>
                            <Form.Control
                                type="number"
                                name="nombreMax"
                                placeholder="Nombre maximum de participants"
                                value={newEvenement.nombreMax}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                placeholder="Date"
                                value={newEvenement.date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                placeholder="Description"
                                value={newEvenement.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrixUnitaire">
                            <Form.Label>Prix unitaire</Form.Label>
                            <Form.Control
                                type="number"
                                name="prixUnitaire"
                                placeholder="Prix unitaire"
                                value={newEvenement.prixUnitaire}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formResponsable">
                            
                            <Form.Control
                                type="hidden"
                                name="responsable"
                                placeholder="Responsable (ID)"
                                value={newEvenement.responsable}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formClubName">
                           
                            <Form.Control
                                type="hidden"
                                value={clubName}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formTerrainId">
                            <Form.Label>Terrain</Form.Label>
                            <Form.Control
                                as="select"
                                name="terrain_id"
                                value={newEvenement.terrain_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un terrain</option>
                                {filteredTerrains.map((terrain) => (
                                    <option key={terrain.id} value={terrain.id}>
                                        {terrain.nom}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Ajouter
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for deleting event */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Supprimer un événement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formRaison">
                            <Form.Label>Raison de la suppression</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="raison"
                                placeholder="Raison de la suppression"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="danger" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AfficheEvenement;