import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Menu from '../Menu/Menu';
// import './reservation.css';

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const terrainId = searchParams.get('terrainId');
  const clubId = searchParams.get('clubId');

  const [reservationData, setReservationData] = useState({
    User_Reserve: '',
    Nb_Place: '',
    Complet: false,
    ispaye: false,
    Type: '',
    Date_Reservation: '',
    Date_TempsReel: '',
    Participants: [],
    terrain_id: terrainId || '',
    club_id: clubId || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Assuming the user ID is stored in local storage after login
    const storedUserId = JSON.parse(localStorage.getItem('user')).id;
    
    if (storedUserId) {
      setReservationData(prevData => ({
        ...prevData,
        User_Reserve: storedUserId,
      }));
    }

    // Fetch terrain details to get the type
    if (terrainId) {
      axios.get(`http://localhost:8000/api/terrains/${terrainId}`)
        .then(response => {
          const terrainType = response.data.type;
          setReservationData(prevData => ({
            ...prevData,
            Type: terrainType,
          }));
        })
        .catch(error => {
          console.error('There was an error fetching the terrain details!', error);
        });
    }
  }, [terrainId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedParticipants = [...reservationData.Participants, { user: reservationData.User_Reserve, equipe: null }];
      const dataToSend = { ...reservationData, Participants: JSON.stringify(updatedParticipants) };
      const response = await axios.post('http://localhost:8000/api/reservation', dataToSend);
      if (response.data) {
        console.log(response.data);
      } else {
        throw new Error('No data received from the server');
      }
      toast.success('Réservation créée avec succès!');
      setReservationData({
        User_Reserve: '',
        Nb_Place: '',
        Complet: false,
        ispaye: false,
        Type: '',
        Date_Reservation: '',
        Date_TempsReel: '',
        Participants: [],
        terrain_id: '',
        club_id: '',
      });
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  const handleEquipeClick = () => {
    navigate('/equipe');
  };

  return (
    <div>
      <Menu />
      <div className="reservation-container">
        <h2>Créer une Réservation</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="User_Reserve" value={reservationData.User_Reserve} />
          <input type="number" name="Nb_Place" placeholder="Nombre de places" value={reservationData.Nb_Place} onChange={handleChange} required />
          <input type="text" name="Type" placeholder="Type" value={reservationData.Type} onChange={handleChange} required readOnly />
          <input type="datetime-local" name="Date_Reservation" placeholder="Date de réservation" value={reservationData.Date_Reservation} onChange={handleChange} required />
          <input type="datetime-local" name="Date_TempsReel" placeholder="Date temps réel" value={reservationData.Date_TempsReel} onChange={handleChange} required />
          <input type="hidden" name="terrain_id" value={reservationData.terrain_id} />
          <input type="hidden" name="club_id" value={reservationData.club_id} />
          <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'Réserver'}</button>
        </form>
        <button onClick={handleEquipeClick}>See Reservation</button>
      </div>
    </div>
  );
};

export default Reservation;