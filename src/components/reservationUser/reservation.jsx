import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Menu from '../Menu/Menu';

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
  const [dateUnavailable, setDateUnavailable] = useState(false);

  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem('user'))?.id;

    if (storedUserId) {
      setReservationData((prevData) => ({
        ...prevData,
        User_Reserve: storedUserId,
      }));
    }

    if (terrainId) {
      axios
        .get(`http://localhost:8000/api/terrains/${terrainId}`)
        .then((response) => {
          const terrainType = response.data.type;
          setReservationData((prevData) => ({
            ...prevData,
            Type: terrainType,
          }));
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des détails du terrain.', error);
        });
    }

    // Set Date_Reservation to the current date and time
    setReservationData((prevData) => ({
      ...prevData,
      Date_Reservation: new Date().toISOString().slice(0, 16),
    }));
  }, [terrainId]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });

    if (name === 'Date_TempsReel') {
      console.log('Date_TempsReel:', value);
      try {
        // Fetch all reservations
        const reservationsResponse = await axios.get('http://localhost:8000/api/reservation');
        const reservations = reservationsResponse.data;

        // Check if there is at least a 2-hour gap between real-time reservation dates for the same terrain
        const selectedDate = new Date(value);
        const isDateUnavailable = reservations.some((reservation) => {
          // console.log(reservationData.terrain_id==reservation.terrain.id);
          if (reservationData.terrain_id==reservation.terrain.id) {
            const reservationDate = new Date(reservation.Date_TempsReel);
            const timeDifference = Math.abs(selectedDate - reservationDate) / (1000 * 60 * 60);
            return timeDifference < 2;
          }
          return false;
        });
        console.log(isDateUnavailable)

        if (isDateUnavailable) {
          setDateUnavailable(true);
          toast.error('Cette date n\'est pas disponible pour ce terrain.');
        } else {
          setDateUnavailable(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des réservations.', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDateUnavailable(false);
    try {
      // Fetch all reservations
      const reservationsResponse = await axios.get('http://localhost:8000/api/reservation');
      const reservations = reservationsResponse.data;

      // Check if there is at least a 2-hour gap between real-time reservation dates for the same terrain
      const selectedDate = new Date(reservationData.Date_TempsReel);
      const isDateUnavailable = reservations.some((reservation) => {
        if (reservation.terrain_id === reservationData.terrain_id) {
          const reservationDate = new Date(reservation.Date_TempsReel);
          const timeDifference = Math.abs(selectedDate - reservationDate) / (1000 * 60 * 60);
          return timeDifference < 2;
        }
        return false;
      });

      if (isDateUnavailable) {
        setDateUnavailable(true);
        toast.error('Cette date n\'est pas disponible pour ce terrain.');
        setLoading(false);
        return;
      }

      const updatedParticipants = [
        ...reservationData.Participants,
        { user: reservationData.User_Reserve, equipe: null },
      ];
      const dataToSend = { ...reservationData, Participants: JSON.stringify(updatedParticipants) };

      const response = await axios.post('http://localhost:8000/api/reservation', dataToSend);
      if (response.data) {
        toast.success('Réservation créée avec succès !');
      } else {
        throw new Error('Aucune réponse reçue du serveur.');
      }
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
      <div className="reservation-container" style={styles.container}>
        <h2 style={styles.title}>Créer une Réservation</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {dateUnavailable && <p style={styles.error}>Cette date n'est pas disponible pour ce terrain.</p>}
          <input type="hidden" name="User_Reserve" value={reservationData.User_Reserve} />
          <input type="hidden" name="Date_Reservation" value={reservationData.Date_Reservation} />
          <div style={styles.inputGroup}>
            <label htmlFor="Nb_Place">Nombre de places :</label>
            <input
              type="number"
              id="Nb_Place"
              name="Nb_Place"
              placeholder="Entrez le nombre de places"
              value={reservationData.Nb_Place}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="Type">Type de terrain :</label>
            <input
              type="text"
              id="Type"
              name="Type"
              value={reservationData.Type}
              readOnly
              style={{ ...styles.input, backgroundColor: '#f1f1f1' }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="Date_TempsReel">Date réservation :</label>
            <input
              type="datetime-local"
              id="Date_TempsReel"
              name="Date_TempsReel"
              value={reservationData.Date_TempsReel}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.buttonGroup}>
            <button className='me-3' type="submit" hidden={loading || dateUnavailable} style={styles.buttonPrimary}>
              {loading ? 'Chargement...' : 'Réserver'}
            </button>
            <button type="button" onClick={handleEquipeClick} style={styles.buttonSecondary}>
              Voir Réservations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '150px',
    maxWidth: '80%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    marginTop: '100px',
    with: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonPrimary: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
};

export default Reservation;
