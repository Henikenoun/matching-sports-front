
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

    fetchReservations();
    const currentUser = JSON.parse(localStorage.getItem('user')).id;
    setC(currentUser);
    console.log(currentUser);
  }, []);

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
            <button onClick={() => navigate(`/details/${reservation.id}`)}>Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipe;