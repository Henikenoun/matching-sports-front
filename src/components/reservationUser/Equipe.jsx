import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./css.css"; // Import the updated CSS file
import { useNavigate } from 'react-router-dom';
import Menu from '../Menu/Menu'; // Import the Menu component

const Equipe = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState({});
  const [equipeData, setEquipeData] = useState({
    nom: '',
    type: '',
    nombre: '',
    reservation_id: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDemandeForm, setShowDemandeForm] = useState(false);
  const [demandeData, setDemandeData] = useState({
    user_id: '',
    equipe_id: '',
    etat: '',
    date: '',
  });

  // Charger les réservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/reservation');
        setReservations(response.data);

        // Fetch user details for each reservation
        const userIds = response.data.map(reservation => reservation.User_Reserve);
        const uniqueUserIds = [...new Set(userIds)];
        const userResponses = await Promise.all(uniqueUserIds.map(id => axios.get(`http://localhost:8000/api/users/${id}`)));
        const usersData = userResponses.reduce((acc, userResponse) => {
          acc[userResponse.data.id] = userResponse.data;
          return acc;
        }, {});
        setUsers(usersData);
      } catch (error) {
        toast.error('Erreur lors de la récupération des réservations.');
      }
    };
    fetchReservations();
  }, []);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipeData({ ...equipeData, [name]: value });
  };

  const handleDemandeChange = (e) => {
    const { name, value } = e.target;
    setDemandeData({ ...demandeData, [name]: value });
  };

  // Soumettre le formulaire d'équipe
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const reservationId = parseInt(e.target.elements['reservation_id'].value);

    try {
      // Étape 1 : Créer l'équipe
      const equipeResponse = await axios.post('http://localhost:8000/api/equipes', {
        ...equipeData,
        reservation_id: reservationId,
      });
      const newEquipeId = equipeResponse.data.equipe.id;

      // Étape 2 : Récupérer les participants actuels de la réservation
      const reservation = reservations.find((r) => r.id === reservationId);

      let updatedParticipants = reservation.Participants || [];
      if (typeof updatedParticipants === 'string') {
        updatedParticipants = JSON.parse(updatedParticipants); // Si c'est une chaîne JSON
      }

      // Ajouter ou mettre à jour un participant
      const currentUser = reservation.User_Reserve;

      if (!updatedParticipants.some((participant) => participant.user === currentUser)) {
        updatedParticipants.push({
          user: currentUser,
          equipe: newEquipeId,
        });
      }

      // Étape 3 : Mettre à jour la réservation avec les nouveaux participants
      const response = await axios.put(`http://localhost:8000/api/reservation/${reservationId}`, {
        Participants: JSON.stringify(updatedParticipants),
      });

      toast.success('Équipe créée et réservation mise à jour avec succès!');

      // Réinitialiser les champs
      setEquipeData({
        nom: '',
        type: '',
        nombre: '',
        reservation_id: null,
      });

      // Mettre à jour localement les données des réservations
      const updatedReservations = reservations.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            Participants: updatedParticipants,
          };
        }
        return r;
      });
      navigate(0)
      setReservations(updatedReservations);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'équipe ou de la mise à jour de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  // Soumettre le formulaire de demande
  const handleDemandeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/demandes', demandeData);
      console.log(response)
      toast.success('Demande envoyée avec succès!');
      setShowDemandeForm(false);
      setDemandeData({
        user_id: '',
        equipe_id: '',
        etat: '',
        date: '',
      });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la demande.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si le bouton "Ajouter Équipe" doit être affiché
  const canAddEquipe = (participants, currentUser) => {
    if (typeof participants === 'string') {
      participants = JSON.parse(participants); // Si c'est une chaîne JSON
    }

    const totalEquipes = participants?.length || 0;
    const userHasEquipe = participants?.some((p) => p.user === currentUser);

    return totalEquipes < 2 && !userHasEquipe;
  };

  return (
    <div>
      <Menu /> {/* Add the Menu component as the navbar */}
      <h2>Liste des Réservations</h2>
      <div className="reservation-container">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <h3>Réservation de : {users[reservation.User_Reserve]?.name || reservation.User_Reserve}</h3>
            <p>Nombre de places: {reservation.Nb_Place}</p>
            <p>Type: {reservation.Type}</p>
            <p>Date de réservation: {reservation.Date_Reservation}</p>
            <p>Date temps réel: {reservation.Date_TempsReel}</p>
            <p>Participants: {JSON.stringify(reservation.Participants)}</p>

            {canAddEquipe(reservation.Participants, reservation.User_Reserve) && (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom de l'équipe"
                  value={equipeData.nom}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="type"
                  placeholder="Type"
                  value={equipeData.type}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="nombre"
                  placeholder="Nombre de membres"
                  value={equipeData.nombre}
                  onChange={handleChange}
                  required
                />
                <input type="hidden" name="reservation_id" value={reservation.id} />
                <button type="submit" disabled={loading}>
                  {loading ? 'Chargement...' : 'Ajouter Équipe'}
                </button>
              </form>
            )}

            {reservation.Participants && JSON.parse(reservation.Participants).map((participant, index) => (
              <div key={index} className="participant-card">
                <p>Participant: {participant.user}</p>
                <p>Équipe: {participant.equipe}</p>
                <button onClick={() => {
                  setShowDemandeForm(true);
                  setDemandeData({ ...demandeData, equipe_id: participant.equipe });
                }}>+</button>
              </div>
            ))}

            {showDemandeForm && (
              <form onSubmit={handleDemandeSubmit}>
                <input
                  type="text"
                  name="user_id"
                  placeholder="ID Utilisateur"
                  value={demandeData.user_id}
                  onChange={handleDemandeChange}
                  required
                />
                <input
                  type="text"
                  name="etat"
                  placeholder="État"
                  value={demandeData.etat}
                  onChange={handleDemandeChange}
                  required
                />
                <input
                  type="datetime-local"
                  name="date"
                  placeholder="Date"
                  value={demandeData.date}
                  onChange={handleDemandeChange}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Chargement...' : 'Envoyer Demande'}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipe;