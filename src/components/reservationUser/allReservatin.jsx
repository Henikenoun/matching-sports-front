import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardContent, Typography, Container, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Menu from '../Menu/Menu';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState({});
  const [teams, setTeams] = useState({});
  const [showEquipeForm, setShowEquipeForm] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [equipeData, setEquipeData] = useState({
    nom: '',
    type: '',
    nombre: '',
    reservation_id: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const [reservationsResponse, clubsResponse, teamsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/reservation'),
          axios.get('http://localhost:8000/api/clubs'),
          axios.get('http://localhost:8000/api/equipes')
        ]);

        const reservationsData = reservationsResponse.data || [];
        console.log('Clubs response:', clubsResponse.data); // Debugging line
        console.log('Teams response:', teamsResponse.data); // Debugging line

        const clubsData = Array.isArray(clubsResponse.data) ? clubsResponse.data.reduce((acc, club) => {
          acc[club.id] = club.nom;
          return acc;
        }, {}) : {};

        const teamsData = Array.isArray(teamsResponse.data.equipes) ? teamsResponse.data.equipes.reduce((acc, team) => {
          acc[team.id] = team.nom;
          return acc;
        }, {}) : {};
        console.log('Processed teams:', teamsData); // Debugging line

        setReservations(reservationsData);
        setClubs(clubsData);
        setTeams(teamsData);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleAddTeam = (reservationId) => {
    setShowEquipeForm(true);
    setSelectedReservationId(reservationId);
  };

  const handleViewDetails = (reservationId) => {
    navigate(`/reservation-details?reservationId=${reservationId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipeData({ ...equipeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const reservationId = parseInt(e.target.elements['reservation_id'].value);
    const reservation = reservations.find((r) => r.id === reservationId);

    try {
      const equipeResponse = await axios.post('http://localhost:8000/api/equipes', {
        ...equipeData,
        type: reservation.Type,
        reservation_id: reservationId,
      });
      const newEquipeId = equipeResponse.data.equipe.id;

      let updatedParticipants = reservation.Participants || [];
      if (typeof updatedParticipants === 'string') {
        updatedParticipants = JSON.parse(updatedParticipants);
      }

      const currentUser = JSON.parse(localStorage.getItem('user')).id;

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

      await axios.put(`http://localhost:8000/api/reservation/${reservationId}`, {
        Participants: JSON.stringify(updatedParticipants),
      });

      setEquipeData({
        nom: '',
        type: '',
        nombre: '',
        reservation_id: null,
      });

      const updatedReservations = reservations.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            Participants: updatedParticipants,
          };
        }
        return r;
      });
      setReservations(updatedReservations);
      setShowEquipeForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      navigate(0);
    }
  };

  const reservationList = useMemo(() => (
    reservations.map(reservation => (
      <Grid item xs={12} sm={6} md={4} key={reservation.id}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Reservation ID: {reservation.id}
            </Typography>
            <Typography color="textSecondary">
              User Reserve: {reservation.User_Reserve}
            </Typography>
            <Typography color="textSecondary">
              Number of Places: {reservation.Nb_Place}
            </Typography>
            <Typography color="textSecondary">
              Type: {reservation.Type}
            </Typography>
            <Typography color="textSecondary">
              Date of Reservation: {reservation.Date_Reservation}
            </Typography>
            <Typography color="textSecondary">
              Real-time Date: {reservation.Date_TempsReel}
            </Typography>
            <Typography color="textSecondary" className='border p-2'>
              <strong>Participants:</strong>
              {reservation.Participants && JSON.parse(reservation.Participants).map((participant, index) => (
                <div key={index}>
                  {/* <p>Participant: {participant.user}</p> */}
                  <p>Équipe: {teams[participant.equipe]}</p>
                </div>
              ))}
              {console.log('teams:', teams)} {/* Debugging line */}
            </Typography>
            <Typography color="textSecondary">
              Club: {clubs[reservation.club_id]}
            </Typography>
            <Typography color="textSecondary">
              Terrain: {reservation.terrain.nom}
            </Typography>
            <Typography color="textSecondary">
              Status: {reservation.Complet ? 'Complete' : 'Incomplete'}
            </Typography>
            <Typography color="textSecondary">
              Paid: {reservation.ispaye ? 'Yes' : 'No'}
            </Typography>
            {reservation.Participants && JSON.parse(reservation.Participants).length < 2 && (
              <Button variant="contained" color="primary" onClick={() => handleAddTeam(reservation.id)}>
                Ajouter Équipe
              </Button>
            )}
            <button onClick={() => navigate(`/details/${reservation.id}`)}>Details</button>
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
                <Button type="submit" disabled={loading}>
                  {loading ? 'Chargement...' : 'Ajouter Équipe'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))
  ), [reservations, clubs, teams, showEquipeForm, selectedReservationId, equipeData, loading]);

  return (
    <>
    <Menu /> 
    <Container style={{marginTop:"100px"}}>
      <h1 className="my-4">Reservations</h1>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : ( 
        <Grid container spacing={3}>
          {reservationList}
        </Grid>
      )}
    </Container>
    </>
    
  );
};

export default Reservations;