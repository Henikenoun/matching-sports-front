import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./css.css"; // Import the updated CSS file
import { useNavigate, useParams } from 'react-router-dom';
import Menu from '../Menu/Menu'; // Import the Menu component

const DetailsReservations = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the reservation ID from the URL
  const [reservation, setReservation] = useState(null);
  const [users, setUsers] = useState({});
  const [teams, setTeams] = useState({});
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

  // Charger les détails de la réservation et les demandes
  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const [reservationResponse, demandesResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/reservation/${id}`),
          axios.get('http://localhost:8000/api/demandes?with=users,equipes')
        ]);

        const reservationData = reservationResponse.data;
        setReservation(reservationData);
        setDemandes(demandesResponse.data.demandes);

        // Extract user and team details from demandes
        const usersData = demandesResponse.data.demandes.reduce((acc, demande) => {
          
          acc[demande.user.id] = demande.user;
          return acc;
        }, {});
        const e = await axios.get('http://localhost:8000/api/equipes').then(res=>{
console.log(res.data.equipes)
          setTeams(res.data.equipes)
        }
        )

        setUsers(usersData);
        // setTeams(teamsData);

        const currentUser = JSON.parse(localStorage.getItem('user')).id;
        setC(currentUser);
        console.log(currentUser);
      } catch (error) {
        toast.error('Erreur lors de la récupération des détails de la réservation.');
      }
    };

    fetchReservationDetails();
  }, [id]);

  // Memoize the participants to avoid unnecessary re-renders
  const participants = useMemo(() => {
    return reservation ? JSON.parse(reservation.Participants) : [];
  }, [reservation]);

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

    try {
      // Étape 1 : Créer l'équipe
      const equipeResponse = await axios.post('http://localhost:8000/api/equipes', {
        ...equipeData,
        type: reservation.Type, // Set team type to match reservation type
        reservation_id: reservation.id,
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
      await axios.put(`http://localhost:8000/api/reservation/${reservation.id}`, {
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

      // Mettre à jour localement les données de la réservation
      setReservation(prevReservation => ({
        ...prevReservation,
        Participants: updatedParticipants,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de l'équipe ou de la mise à jour de la réservation.");
    } finally {
      setLoading(false);
    }
    navigate(0);
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
      setDemandes([...demandes, demande]); // Ajouter la nouvelle demande à l'état
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la demande.");
    } finally {
      setLoading(false);
      navigate(0);
      
    }
  };

  // Fonction pour vérifier si le bouton "Ajouter Équipe" doit être affiché
  const canAddEquipe = (participants, currentUser) => {
    if (typeof participants === 'string') {
      participants = JSON.parse(participants); // Si c'est une chaîne JSON
    }
    const totalEquipes = participants?.length || 0;
    const userHasEquipe = participants?.some((p) => p.user === currentUser && p.equipe);
    const hasSentRequest = demandes.some((demande) => demande.user_id === currentUser && demande.reservation_id === reservation.id);
    // console.log(hasSentRequest);
    // console.log("a        :",totalEquipes)
    return totalEquipes < 2 && !userHasEquipe && !hasSentRequest;
  };

  // Fonction pour vérifier si le bouton "+" doit être affiché
  const canJoinEquipe = (participants, currentUser, equipeId) => {
    if (typeof participants === 'string') {
      participants = JSON.parse(participants); // Si c'est une chaîne JSON
    }

    const hasSentRequest = demandes.some((demande) => demande.user_id === currentUser && demande.equipe_id === equipeId);
    console.log(hasSentRequest)
    return !participants.some((p) => p.user === currentUser) && !hasSentRequest;
  };

  if (!reservation) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Menu /> {/* Add the Menu component as the navbar */}
      <h2>Détails de la Réservation</h2>
      <div className="reservation-details">
        <h3>Réservation de : {users[reservation.User_Reserve]?.name || reservation.User_Reserve}</h3>
        <p>Nombre de places: {reservation.Nb_Place}</p>
        <p>Type: {reservation.Type}</p>
        <p>Date de réservation: {reservation.Date_Reservation}</p>
        <p>Date temps réel: {reservation.Date_TempsReel}</p>
        <h4>Participants:</h4>
        {participants.map((participant, index) => (
          <div key={index} className="participant-card">
            {/* {console.log(participant)} */}
            {/* <p>Participant: {users[participant.user]?.name || 'Utilisateur inconnu'}</p> */}
            { (
              <>
              <p>Équipe: {teams && Object.values(teams).find(equipe => equipe.id === participant.equipe)?.nom}</p>
              <p>Membres de l'équipe:</p>
              <ul>
                {demandes && demandes.filter(demande => demande.equipe_id === participant.equipe).map(demande => (
                  <li key={demande.id}>{users[demande.user_id]?.name || 'Utilisateur inconnu'}</li>
                ))}
              </ul>
              </>
            )}
            {console.log(participant.equipe)}
            { (
              <button onClick={() => handleDemandeSubmit(participant)}>Demander</button>
            )}
          </div>
        ))}
        {canAddEquipe(participants, c) && (
          <button onClick={() => setShowEquipeForm(true)}>
            Ajouter Équipe
          </button>
        )}
        {showEquipeForm && (
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
      </div>
    </div>
  );
};

export default DetailsReservations;