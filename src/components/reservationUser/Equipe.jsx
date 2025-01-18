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
  const [c, setC] = useState(null);
  const [equipeData, setEquipeData] = useState({
    nom: '',
    type: '',
    nombre: '',
    reservation_id: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDemandeForm, setShowDemandeForm] = useState(null);
  const [showEquipeForm, setShowEquipeForm] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [demandeData, setDemandeData] = useState({
    user_id: '',
    equipe_id: '',
    etat: '',
    date: '',
  });
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedEquipe, setSelectedEquipe] = useState(null);
  const [demandes, setDemandes] = useState([]); // État pour stocker les demandes

  // Charger les réservations et les demandes
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

    const fetchDemandes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/demandes');
        setDemandes(response.data.demandes); // Ensure we set the correct array
      } catch (error) {
        toast.error('Erreur lors de la récupération des demandes.');
      }
    };

    fetchReservations();
    fetchDemandes();
    const currentUser = JSON.parse(localStorage.getItem('user')).id;
    setC(currentUser);
    console.log(currentUser);
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
    const reservation = reservations.find((r) => r.id === reservationId);

    try {
      // Étape 1 : Créer l'équipe
      const equipeResponse = await axios.post('http://localhost:8000/api/equipes', {
        ...equipeData,
        type: reservation.Type, // Set team type to match reservation type
        reservation_id: reservationId,
      });
      const newEquipeId = equipeResponse.data.equipe.id; // Correctly get the new team ID
      console.log(equipeResponse.data.equipe.id);

      // Étape 2 : Récupérer les participants actuels de la réservation
      let updatedParticipants = reservation.Participants || [];
      if (typeof updatedParticipants === 'string') {
        updatedParticipants = JSON.parse(updatedParticipants); // Si c'est une chaîne JSON
      }

      // Ajouter ou mettre à jour un participant
      const currentUser = JSON.parse(localStorage.getItem('user')).id;
      console.log(currentUser);

      if (!updatedParticipants.some((participant) => participant.user === currentUser)) {
        updatedParticipants.push({
          user: currentUser,
          equipe: newEquipeId,
        });
      } else {
        updatedParticipants = updatedParticipants.map((participant) =>
          participant.user === currentUser ? { ...participant, equipe: newEquipeId } : participant
        );
      }
      console.log(updatedParticipants);

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
      navigate(0);
      setReservations(updatedReservations);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'équipe ou de la mise à jour de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  // Soumettre le formulaire de demande
  const handleDemandeSubmit = async (participant) => {
    setLoading(true);

    try {
      const demande = {
        user_id: c,
        equipe_id: participant.equipe,
        etat: '',
        date: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format the date correctly
      };
      const response = await axios.post('http://localhost:8000/api/demandes', demande);
      console.log(response);
      toast.success('Demande envoyée avec succès!');
      setShowDemandeForm(null);
      setDemandes([...demandes, demande]); // Ajouter la nouvelle demande à l'état
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la demande.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si le bouton "Ajouter Équipe" doit être affiché
  const canAddEquipe = (participants, currentUser, reservationId) => {
    if (typeof participants === 'string') {
      participants = JSON.parse(participants); // Si c'est une chaîne JSON
    }

    const totalEquipes = participants?.length || 0;
    const userHasEquipe = participants?.some((p) => p.user === currentUser && p.equipe);
    const hasSentRequest = demandes.some((demande) => demande.user_id === currentUser && demande.reservation_id === reservationId);
    console.log(hasSentRequest);
    return totalEquipes < 2 && !userHasEquipe && !hasSentRequest;
  };

  // Fonction pour vérifier si le bouton "+" doit être affiché
  const canJoinEquipe = (participants, currentUser, equipeId) => {
    if (typeof participants === 'string') {
      participants = JSON.parse(participants); // Si c'est une chaîne JSON
    }

    const hasSentRequest = demandes.some((demande) => demande.user_id === currentUser && demande.equipe_id === equipeId);

    return !participants.some((p) => p.user === currentUser) && !hasSentRequest;
  };

  // Fonction pour vérifier ou créer une conversation et rediriger vers l'interface de conversation
 const handleContactClick = async (reservationUserId) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const currentUser = JSON.parse(localStorage.getItem('user')).id; // Get the current user's ID from local storage

    // Log the current user ID and reservation user ID
    console.log('Current User ID:', currentUser);
    console.log('Reservation User ID:', reservationUserId);

    // Vérifier s'il existe déjà une conversation entre les deux utilisateurs
    const response = await axios.get(`http://localhost:8000/api/conversations/by-user-ids?user_one_id=${currentUser}&user_two_id=${reservationUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the Bearer token in the request headers
      },
    });

    let conversationId;
    if (response.data) {
      console.log('Existing conversation ID:', response.data.id);
      conversationId = response.data.id;
    } else {
      console.log('No existing conversation found.');
    }

    // Rediriger vers l'interface de conversation si une conversation existe
    if (conversationId) {
      navigate(`/conversations/${conversationId}`);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de la conversation:', error.response?.data || error.message);
    toast.error("Erreur lors de la vérification de la conversation.");
  }
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
            {/* <p>Participants: {JSON.stringify(reservation.Participants)}</p> */}

            <button onClick={() => handleContactClick(reservation.User_Reserve)}>Contacter</button>

            {canAddEquipe(reservation.Participants, c, reservation.id) && (
              <button onClick={() => {
                setShowEquipeForm(true);
                setSelectedReservationId(reservation.id);
              }}>
                Ajouter Équipe
              </button>
            )}

            {showEquipeForm && selectedReservationId === reservation.id && (
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
                  value={reservation.Type}
                  onChange={handleChange}
                  required
                  readOnly
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
                {participant.user !== c && canJoinEquipe(reservation.Participants, c, participant.equipe) && (
                  <button onClick={() => handleDemandeSubmit(participant)}>+</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipe;