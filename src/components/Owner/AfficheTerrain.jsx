import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const AfficheTerrains = () => {
    const [terrains, setTerrains] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(6); // Nombre d'éléments par page
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [newTerrain, setNewTerrain] = useState({
        nom: '',
        type: '',
        disponibilite: true,
        capacite: '',
        fraisLocation: '',
        club_id: ''
    });

    // Fonction pour récupérer les terrains associés au club de l'utilisateur connecté
    const fetchTerrains = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                const userResponse = await axios.get(`http://localhost:8000/api/users/${user.id}`);
                const userData = userResponse.data;

                if (userData.club && userData.club.id) {
                    const terrainsResponse = await axios.get(`http://localhost:8000/api/clubs/${userData.club.id}/terrains`);
                    setTerrains(terrainsResponse.data);
                    setNewTerrain((prevState) => ({ ...prevState, club_id: userData.club.id }));
                } else {
                    console.log("Aucun club associé à l'utilisateur");
                }
            } else {
                console.log("Aucun utilisateur trouvé dans localStorage");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des terrains", error);
        }
    };

    // Utilisation de useEffect pour récupérer les données au montage du composant
    useEffect(() => {
        fetchTerrains();
    }, []);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTerrains = terrains.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer la page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcul du nombre de pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(terrains.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Handle form input change
    const handleChange = (e) => {
        setNewTerrain({ ...newTerrain, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/terrains', newTerrain);
            fetchTerrains(); // Refresh the list of terrains
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Erreur lors de l\'ajout du terrain:', error);
        }
    };

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 className="recent-Articles"> Terrains </h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>Ajouter un terrain</Button> {/* Button to show modal */}
            </div>

            <div className="report-body">
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Disponibilité</th>
                            <th>Capacité</th>
                            <th>Frais de Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTerrains.map((terrain, idx) => (
                            <tr key={idx}>
                                <td>{terrain.nom}</td>
                                <td>{terrain.type}</td>
                                <td>{terrain.disponibilite ? 'Disponible' : 'Indisponible'}</td>
                                <td>{terrain.capacite}</td>
                                <td>{terrain.fraisLocation} €</td>
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

            {/* Modal for adding terrain */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un terrain</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNom">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                name="nom"
                                placeholder="Nom du terrain"
                                value={newTerrain.nom}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={newTerrain.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Choisissez un type</option>
                                <option value="Football">Football</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Padel">Padel</option>
                                <option value="Volley">Volley</option>
                                <option value="Basketball">Basketball</option>
                            </Form.Control>


                        </Form.Group>
                        <Form.Group controlId="formCapacite">
                            <Form.Label>Capacité</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacite"
                                placeholder="Capacité"
                                value={newTerrain.capacite}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formFraisLocation">
                            <Form.Label>Frais de Location</Form.Label>
                            <Form.Control
                                type="number"
                                name="fraisLocation"
                                placeholder="Frais de Location"
                                value={newTerrain.fraisLocation}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Ajouter
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AfficheTerrains;