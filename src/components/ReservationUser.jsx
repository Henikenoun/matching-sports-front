import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin/Pag.css';
import Menu from './Menu/Menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const ReservationUser = () => {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [teams, setTeams] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const userId = JSON.parse(localStorage.getItem('user')).id; // Assuming user ID is stored in localStorage

    const fetchReservations = async () => {
        try {
            const [reservationsResponse, demandesResponse, teamsResponse] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/reservation'),
                axios.get('http://127.0.0.1:8000/api/demandes'),
                axios.get('http://127.0.0.1:8000/api/equipes')
            ]);

            const teamsData = Array.isArray(teamsResponse.data.equipes) ? teamsResponse.data.equipes.reduce((acc, team) => {
                acc[team.id] = team.nom;
                return acc;
            }, {}) : {};

            const userReservations = reservationsResponse.data.filter(reservation => 
                reservation.User_Reserve === userId || 
                JSON.parse(reservation.Participants).some(participant => participant.user === userId)
            );

            const userDemandes = demandesResponse.data.demandes.filter(demande => demande.user_id === userId);

            setReservations(userReservations);
            setDemandes(userDemandes);
            setTeams(teamsData);
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

    const handleReservationDetailsClick = (reservationId) => {
        const reservation = reservations.find(r => r.id === reservationId);
        setSelectedReservation(reservation);
    };

    const handleDemandeDetailsClick = (demandeId) => {
        const demande = demandes.find(d => d.id === demandeId);
        setSelectedDemande(demande);
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/reservation/${reservationId}`);
            setReservations(reservations.filter(r => r.id !== reservationId));
            setSelectedReservation(null);
            toast.success('Réservation annulée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la réservation', error);
            toast.error('Erreur lors de l\'annulation de la réservation');
        }
    };

    const handleDeleteDemande = async (demandeId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/demandes/${demandeId}`);
            setDemandes(demandes.filter(d => d.id !== demandeId));
            setSelectedDemande(null);
            toast.success('Demande supprimée avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression de la demande', error);
            toast.error('Erreur lors de la suppression de la demande');
        }
    };

    const handleCancelDemande = async (demandeId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/demandes/${demandeId}`, { etat: 'annulé' });
            setDemandes(demandes.map(d => d.id === demandeId ? { ...d, etat: 'annulé' } : d));
            setSelectedDemande(null);
            toast.success('Demande annulée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la demande', error);
            toast.error('Erreur lors de l\'annulation de la demande');
        }
    };

    const openModal = (content) => {
        setModalContent(content);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent({});
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
        const timeDifference = (new Date(selectedReservation.Date_TempsReel) - new Date()) / (1000 * 60 * 60);
        return (
            <div>
                <Menu /> 
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
                <p><strong>Participants:</strong></p>
                {JSON.parse(selectedReservation.Participants).map((participant, index) => (
                    <div key={index}>
                        <p>Participant: {participant.user}</p>
                        <p>Équipe: {teams[participant.equipe]}</p>
                    </div>
                ))}
                {timeDifference > 48 && (
                    <button className='bg-danger mb-3' onClick={() => openModal({
                        title: 'Confirmer l\'annulation',
                        message: 'Êtes-vous sûr de vouloir annuler cette réservation?',
                        onConfirm: () => handleCancelReservation(selectedReservation.id)
                    })}>Annuler Réservation</button>
                )}
                <button onClick={() => setSelectedReservation(null)} className='bg-success'>Retour</button>
            </div>
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Confirmation Modal"
            ariaHideApp={false}
            style={{
                content: {
                    position: 'absolute',
                    zIndex:100,
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    padding: '20px'
                }
            }}
        >
            <h2>{modalContent.title}</h2>
            <p>{modalContent.message}</p>
            <button onClick={modalContent.onConfirm} className='bg-success mb-3'>Confirmer</button>
            <button onClick={closeModal} className='bg-danger'>Annuler</button>
        </Modal>
            </div>
        );
    }

    if (selectedDemande) {
        const reservation = reservations.find(r => JSON.parse(r.Participants).some(p => p.equipe === selectedDemande.equipe_id));
        return (
            <div className="report-container p-5">
                <h1>Détails de la Demande</h1>
                <p>Équipe: {teams[selectedDemande.equipe_id]}</p>
                <p>État: {selectedDemande.etat}</p>
                {reservation && (
                    <>
                        <h2>Réservation Associée</h2>
                        <p>Nom du Terrain: {reservation.terrain.nom}</p>
                        <p>Date de reservation: {formatDate(reservation.Date_Reservation)}</p>
                        <p>reservation sera le : {formatDate(reservation.Date_TempsReel)}</p>
                        <p>Nombre de Places: {reservation.Nb_Place}</p>
                        <p>Type: {reservation.Type}</p>
                        <p>Complet: {reservation.Complet ? <span className='text-success'>Oui</span> : <span className='text-danger'>Non</span>}</p>
                        <p>Places Disponibles: {reservation.terrain.capacite - reservation.Nb_Place}</p>
                        <p>Frais de Location: {reservation.terrain.fraisLocation}</p>
                        <p>Payé: {reservation.ispaye ? <span className='text-success'>Oui</span> : <span className='text-danger'>Non</span>}</p>
                    </>
                )}
                {selectedDemande.etat === 'en cours' ? (
                    <button className='bg-danger mb-3' onClick={() => openModal({
                        title: 'Confirmer la suppression',
                        message: 'Êtes-vous sûr de vouloir supprimer cette demande?',
                        onConfirm: () => handleDeleteDemande(selectedDemande.id)
                    })}>Supprimer Demande</button>
                ) : (
                    <button className='bg-danger mb-3' onClick={() => openModal({
                        title: 'Confirmer l\'annulation',
                        message: 'Êtes-vous sûr de vouloir annuler cette demande?',
                        onConfirm: () => handleCancelDemande(selectedDemande.id)
                    })}>Annuler Demande</button>
                )}
                <button className='bg-success' onClick={() => setSelectedDemande(null)}>Retour</button>
                <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Confirmation Modal"
            ariaHideApp={false}
            style={{
                content: {
                    position: 'absolute',
                    zIndex:100,
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    padding: '20px'
                }
            }}
        >
            <h2>{modalContent.title}</h2>
            <p>{modalContent.message}</p>
            <button onClick={modalContent.onConfirm} className='bg-success mb-3'>Confirmer</button>
            <button onClick={closeModal} className='bg-danger'>Annuler</button>
        </Modal>
            </div>
        );
    }

    return (
        <div>
            <Menu />
            <div className="report-container" style={{marginTop:"100px"}}>
            <div className="report-header">
                <h1 className="recent-Articles">Mes Réservations</h1>
            </div>

            <div className="report-body">
                <h2>Réservations</h2>
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
                                    <button onClick={() => handleReservationDetailsClick(reservation.id)}>Détails</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Demandes</h2>
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Équipe</th>
                            <th>État</th>
                            <th>Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demandes.map((demande, idx) => (
                            <tr key={idx}>
                                <td>{teams[demande.equipe_id]}</td>
                                <td>{demande.etat}</td>
                                <td>
                                    <button onClick={() => handleDemandeDetailsClick(demande.id)}>Détails</button>
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
        <ToastContainer />
        
        </div>
    );
};

export default ReservationUser;