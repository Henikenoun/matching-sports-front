import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../Menu/Menu';

const Eventuser = () => {
    const [evenements, setEvenements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const fetchEvenements = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`http://localhost:8000/api/evenements/p/${user.id}`);
            const userEvents = response.data;
            setEvenements(userEvents);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements', error);
        }
    };

    useEffect(() => {
        fetchEvenements();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvenements = evenements.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(evenements.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Menu />
        <div style={{marginTop:'100px'}} className="report-container ">
            <ToastContainer />
            <div className="report-header">
                <h1 className="recent-Articles">Mes Événements</h1>
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
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

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

export default Eventuser;