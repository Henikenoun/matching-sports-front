import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../Menu/Menu';

const AfficheEvenementUser = () => {
    const [evenements, setEvenements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(6); // Nombre d'éléments par page
    const [selectedType, setSelectedType] = useState(''); // Filtre par type d'événement

    // Fonction pour récupérer les événements
    const fetchEvenements = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/evenements');
            const user = JSON.parse(localStorage.getItem('user'));
            const userEvents = response.data.filter(event => event.participants.includes(user.id));
            setEvenements(userEvents); // Stocke les événements de l'utilisateur authentifié
        } catch (error) {
            console.error('Erreur lors de la récupération des événements', error);
        }
    };

    // Utilisation de useEffect pour récupérer les données au montage du composant
    useEffect(() => {
        fetchEvenements();
    }, []);

    // Fonction pour gérer la participation à un événement
    const handleParticiper = async (evenementId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                const response = await axios.put(`http://localhost:8000/api/evenements/ajouterParticipant/${evenementId}`, {
                    participants: [user.id]
                });
                if (response.data.nbActuel > response.data.nombreMax) {
                    toast.error("Le nombre maximal de participants est atteint.");
                } else {
                    fetchEvenements(); // Rafraîchir la liste des événements après participation
                    toast.success("Participation réussie !");
                }
            } else {
                console.error('Utilisateur non connecté');
            }
        } catch (error) {
            console.error('Erreur lors de la participation à l\'événement:', error);
            toast.error("Erreur lors de la participation à l'événement.");
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

    return (
        <>
            <Menu />
        <div  style={{marginTop:'100px'}} className="report-container">
            <ToastContainer />
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
            </div>

            <div className="report-body">
                <Row>
                    {currentEvenements.map((evenement, idx) => (
                        <Col key={idx} sm={12} md={6} lg={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{evenement.nom}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{evenement.type}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Date:</strong> {evenement.date}<br />
                                        <strong>Nb Max:</strong> {evenement.nombreMax}<br />
                                        <strong>Nb Actuel:</strong> {evenement.nbActuel}<br />
                                        <strong>Prix:</strong> {evenement.prixUnitaire} €<br />
                                        <strong>Responsable:</strong> {evenement.responsable?.name || 'N/A'}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => handleParticiper(evenement.id)}>Participer</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

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
        </>
    );
};

export default AfficheEvenementUser;