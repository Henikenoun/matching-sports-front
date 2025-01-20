import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../Menu/Menu';

const NotificationPage = () => {
  const [eventNotifications, setEventNotifications] = useState([]);
  const [cancelledEventNotifications, setCancelledEventNotifications] = useState([]);
  const [reservationNotifications, setReservationNotifications] = useState([]);
  const [reservationResponseNotifications, setReservationResponseNotifications] = useState([]);
  const [demandeNotifications, setDemandeNotifications] = useState([]);
  const [demandeResponseNotifications, setDemandeResponseNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState({});
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    const userClubId = user.club_id; // Get the user's club ID

    const fetchEventNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/notificationsEvents`);
        console.log('Event Notifications:', response.data);
        setEventNotifications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications d\'événements', error);
        toast.error('Erreur lors de la récupération des notifications d\'événements.');
      }
    };

    const fetchCancelledEventNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/notifications/events/annulations`);
        console.log('Cancelled Event Notifications:', response.data);
        setCancelledEventNotifications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications d\'événements annulés', error);
        toast.error('Erreur lors de la récupération des notifications d\'événements annulés.');
      }
    };

    

    const fetchReservationResponseNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/notifications/reservations/accept`);
        console.log('Reservation Response Notifications:', response.data);
        setReservationResponseNotifications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses de réservations', error);
        toast.error('Erreur lors de la récupération des réponses de réservations.');
      }
    };

    const fetchDemandeNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/notifications/demandes`);
        console.log('Demande Notifications:', response.data);
        setDemandeNotifications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications de demandes', error);
        toast.error('Erreur lors de la récupération des notifications de demandes.');
      }
    };

    const fetchDemandeResponseNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/notifications/demandes/accept`);
        console.log('Demande Response Notifications:', response.data);
        setDemandeResponseNotifications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses de demandes', error);
        toast.error('Erreur lors de la récupération des réponses de demandes.');
      }
    };

    const fetchTeamsAndParticipants = async () => {
      try {
        const [teamsResponse, reservationsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/equipes'),
          axios.get('http://localhost:8000/api/reservation')
        ]);
        setTeams(teamsResponse.data.equipes);
        
        const allParticipants = reservationsResponse.data.reduce((acc, reservation) => {
          const participants = JSON.parse(reservation.Participants || '[]');
          return acc.concat(participants);
        }, []);
        console.log(allParticipants)

        setParticipants(allParticipants);
      } catch (error) {
        console.error('Erreur lors de la récupération des équipes et des participants', error);
        toast.error('Erreur lors de la récupération des équipes et des participants.');
      }
    };

    const fetchAllNotifications = async () => {
      setLoading(true);
      await Promise.all([
        fetchEventNotifications(),
        fetchCancelledEventNotifications(),
        fetchReservationNotifications(),
        fetchReservationResponseNotifications(),
        fetchDemandeNotifications(),
        fetchDemandeResponseNotifications(),
        fetchTeamsAndParticipants()
      ]);
      setLoading(false);
    };

    fetchAllNotifications();
  }, []);

  // if (loading) {
  //   return <div>Chargement...</div>;
  // }
  const acceptReservation = async (id) => {
    try {
        await axios.post(`http://127.0.0.1:8000/api/demandes/${id}/acceptr`);
        fetchAllNotifications();

    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la réservation', error);
    }
};

const refuseReservation = async (id) => {
    try {
        await axios.post(`http://127.0.0.1:8000/api/demandes/${id}/refuser`);
        fetchAllNotifications();

    } catch (error) {
        console.error('Erreur lors du refus de la réservation', error);
    }
};
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Date invalide' : date.toISOString().split('T')[0];
  };

  const parseMessage = (message) => {
    const regex = /Votre réservation pour le terrain (.*?) au club (.*?) à la date (.*?) a été (acceptée|refusée)\./;
    const match = message.match(regex);
    if (match) {
      return {
        terrain: match[1],
        club: match[2],
        date: match[3],
        status: match[4]
      };
    }
    return null;
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;

  // Filter notifications for the authenticated user
  const filteredEventNotifications = useMemo(() => {
    return eventNotifications.filter(notification => notification.notifiable_id === userId);
  }, [eventNotifications, userId]);

  const filteredCancelledEventNotifications = useMemo(() => {
    return cancelledEventNotifications.filter(notification => notification.notifiable_id === userId);
  }, [cancelledEventNotifications, userId]);

  const filteredReservationNotifications = useMemo(() => {
    return reservationNotifications.filter(notification => notification.notifiable_id === userId);
  }, [reservationNotifications, userId]);

  const filteredReservationResponseNotifications = useMemo(() => {
    return reservationResponseNotifications.filter(notification => notification.notifiable_id === userId);
  }, [reservationResponseNotifications, userId]);

  const filteredDemandeNotifications = useMemo(() => {
    return demandeNotifications.filter(notification => notification.notifiable_id === userId);
  }, [demandeNotifications, userId]);

  const filteredDemandeResponseNotifications = useMemo(() => {
    return demandeResponseNotifications.filter(notification => notification.notifiable_id === userId);
  }, [demandeResponseNotifications, userId]);

  return (
    <div>
      <Menu />
      <div className="container" style={{ marginTop: '100px' }}>
        <h2>Notifications</h2>
        <h3>Événements</h3>
        {filteredEventNotifications.length > 0 ? (
          <ul>
            {filteredEventNotifications.map((notification, index) => {
              const data = JSON.parse(notification.data);
              const creationDate = formatDate(data.date_creation);

              return (
                <li key={index}>
                  <p><strong>Message:</strong> {data.message}</p>
                  <p><strong>Event ID:</strong> {data.event_id}</p>
                  <p><strong>Date de création:</strong> {creationDate}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucune notification d'événement disponible.</p>
        )}

        <h3>Événements annulés</h3>
        {filteredCancelledEventNotifications.length > 0 ? (
          <ul>
            {filteredCancelledEventNotifications.map((notification, index) => {
              const data = JSON.parse(notification.data);
              const creationDate = formatDate(data.date_creation);

              return (
                <li key={index}>
                  <p><strong>Message:</strong> {data.message}</p>
                  <p><strong>Date de création:</strong> {creationDate}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucune notification d'événement annulé disponible.</p>
        )}


        <h3>Réponses aux réservations</h3>
        {reservationResponseNotifications.length > 0 ? (
          <ul>
            {reservationResponseNotifications.map((notification, index) => {
              const data = JSON.parse(notification.data);
              const parsedMessage = parseMessage(data.message);
              const reservationDate = formatDate(data.date);

              return (
                <li key={index}>
                  {parsedMessage ? (
                    <>
                      Votre réservation pour le terrain {parsedMessage.terrain} au club {parsedMessage.club} à la date {parsedMessage.date} a été {parsedMessage.status}.
                    </>
                  ) : (
                    <p><strong>Message:</strong> {data.message}</p>
                  )}
                  <p><strong>Date de réservation:</strong> {reservationDate}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucune notification de réponse de réservation disponible.</p>
        )}

        <h3>Demandes</h3>
        {filteredDemandeNotifications.length > 0 ? (
          <ul>
            {filteredDemandeNotifications.map((notification, index) => {
              const data = JSON.parse(notification.data);
              const demandeDate = formatDate(data.date_demande);

              return (
                <li key={index}>
                  <p><strong>Message:</strong> {data.message}</p>
                  <p><strong>Date de demande:</strong> {demandeDate}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucune notification de demande disponible.</p>
        )}

        <h3>Réponses aux demandes</h3>
        {demandeResponseNotifications.length > 0 ? (
          <ul>
            {demandeResponseNotifications.map((notification, index) => {
              const data = JSON.parse(notification.data);
              const equipeDate = formatDate(data.date_creation);

              return (
                <li key={index}>
                  <p><strong>Message:</strong> {data.message}</p>
                  <p><strong>Équipe ID:</strong> {data.equipe_id}</p>
                  <p><strong>Date de création:</strong> {equipeDate}</p>
                  <button onClick={() => acceptReservation(1)}>Accepter</button>
                  <button onClick={() => refuseReservation(2)}>Refuser</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucune notification de réponse de demande disponible.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default NotificationPage;