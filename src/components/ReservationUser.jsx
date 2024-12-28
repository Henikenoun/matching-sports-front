import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationUser.css';
import Menu from './Menu/Menu';
import { ToastContainer, toast } from 'react-toastify'; // Pour les toasts
import 'react-toastify/dist/ReactToastify.css'; // Style des toasts
import ModifyReservationModal from './ModifyReservationModal'; // Import du modal de modification
import ConfirmationModal from './ConfirmationModal'; // Import du modal de confirmation

const ReservationUser = () => {
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Mode édition
  const [editedReservation, setEditedReservation] = useState(null); // Réservation à modifier

  // Récupérer l'objet client depuis le localStorage
  const clientData = JSON.parse(localStorage.getItem('user'));
  const clientId = clientData ? clientData.idClient : null;

  if (!clientId) {
    toast.error('ID client introuvable, veuillez vous connecter.');
    return; // Si l'ID client est introuvable, arrêter l'exécution
  }

  // Charger les réservations de l'utilisateur
  const fetchReservations = async () => {
    try {
      const response = await axios.get('https://localhost:7050/api/Reservation');
      const userReservations = response.data.filter(reservation => reservation.clientId === clientId);
      setReservations(userReservations);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations', error);
    }
  };

  useEffect(() => {
    fetchReservations(); // Charger les réservations lors du montage
  }, []);

  // Gérer la modification d'une réservation
  const handleModify = (id) => {
    const reservationToEdit = reservations.find(reservation => reservation.id === id);
    setEditedReservation(reservationToEdit);
    setIsEditMode(true); // Passer en mode édition
  };

  // Sauvegarder la modification de la réservation
  const handleSaveModification = async (newDateDebut) => {
    if (!editedReservation) return;

    const parsedDate = new Date(newDateDebut);
    if (isNaN(parsedDate)) {
      toast.error('La date de début n\'est pas valide.');
      return;
    }

    const updatedReservation = {
        reservationId: editedReservation.id,  // Utilisation de 'reservationId' au lieu de 'id'
        clientId: clientId,  // Utilisation de l'ID client récupéré du localStorage
        terrainId: editedReservation.terrain.id,  // ID du terrain
        dateDebut: new Date(parsedDate.getTime() + 60 * 60000).toISOString(),  // dateDebut + 1 heure
        dateFin: new Date(parsedDate.getTime() + 90 * 60000 + 60 * 60000).toISOString()  // dateFin = dateDebut + 1H30 (90 minutes)
      };

    try {
      // Envoi de la requête PUT pour modifier la réservation
      await axios.put(`https://localhost:7050/api/Reservation/${updatedReservation.reservationId}`, updatedReservation);
      fetchReservations(); // Recharger les réservations après la modification
      setIsEditMode(false); // Sortir du mode édition
      toast.success('Réservation modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification de la réservation', error.response || error.message);
      toast.error('Une erreur est survenue lors de la modification.');
    }
  };

  // Gérer la suppression de la réservation
  const handleDeleteConfirmation = (id) => {
    setReservationToDelete(id);
    setIsModalOpen(true);
  };

  // Supprimer la réservation
  const handleDelete = async () => {
    if (!reservationToDelete) {
      console.error('Aucune réservation à supprimer.');
      return;
    }

    try {
      await axios.delete(`https://localhost:7050/api/Reservation/${reservationToDelete}`);
      fetchReservations(); // Recharger les réservations après suppression
      toast.success('Réservation supprimée avec succès');
      setIsModalOpen(false); // Fermer le modal
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error.response || error.message);
      toast.error('Une erreur est survenue lors de la suppression.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fermer le modal sans supprimer
  };

  return (
    <div className="reservation-page">
      <Menu />
      <div className="reservation-container">
        <h1>Mes Réservations</h1>
        <div className="reservations-list">
          {reservations.length === 0 ? (
            <p className="no-reservation">Aucune réservation trouvée</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-item">
                <div className="reservation-details">
                  <p><strong>Terrain:</strong> {reservation.terrain.nom}</p>
                  <p><strong>Date Début:</strong> {new Date(reservation.dateDebut).toLocaleString()}</p>
                  <p><strong>Date Fin:</strong> {new Date(reservation.dateFin).toLocaleString()}</p>
                </div>
                <div className="reservation-actions">
                  <button
                    className="modify-btn"
                    onClick={() => handleModify(reservation.id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteConfirmation(reservation.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Affichage du Modal pour la modification */}
        <ModifyReservationModal 
          isOpen={isEditMode} 
          onClose={() => setIsEditMode(false)} 
          reservation={editedReservation} 
          onSave={handleSaveModification} 
        />

        {/* Affichage du Modal pour la confirmation */}
        <ConfirmationModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onConfirm={handleDelete} 
        />

        {/* Le ToastContainer pour afficher les notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ReservationUser;
