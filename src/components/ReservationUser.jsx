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
  const clientId = 'ff032b49-f332-40bf-b7ef-f88827d66f60'; // ID du client à gérer

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
    fetchReservations(); // Charger les réservations au début
  }, []);

  const handleModify = (id) => {
    const reservationToEdit = reservations.find(reservation => reservation.id === id);
    setEditedReservation(reservationToEdit);
    setIsEditMode(true); // Passer en mode édition
  };

  const handleSaveModification = async (newDateDebut) => {
    if (!editedReservation) return;

    // Vérifier si newDateDebut est une date valide
    const parsedDate = new Date(newDateDebut);
    if (isNaN(parsedDate)) {
      toast.error('La date de début n\'est pas valide.');
      return;
    }

    // Créer l'objet à envoyer avec les bons champs
    const updatedReservation = {
        reservationId: editedReservation.id,  // Utilisation de 'reservationId' au lieu de 'id'
        clientId: editedReservation.clientId,  // ID du client
        terrainId: editedReservation.terrain.id,  // ID du terrain
        dateDebut: new Date(parsedDate.getTime() + 60 * 60000).toISOString(),  // dateDebut + 1 heure
        dateFin: new Date(parsedDate.getTime() + 90 * 60000 + 60 * 60000).toISOString()  // dateFin = dateDebut + 1H30 (90 minutes)
      };
      
      
    console.log("Données envoyées :", updatedReservation);  // Log des données pour débogage

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

  const handleDeleteConfirmation = (id) => {
    setReservationToDelete(id);
    setIsModalOpen(true);
  };

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
