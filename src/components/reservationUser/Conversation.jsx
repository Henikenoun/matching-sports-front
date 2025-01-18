import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Menu from '../Menu/Menu'; // Use your existing Navbar component
import './Conversation.css';
import moment from 'moment'; // For formatting timestamps
import { FaPaperPlane } from 'react-icons/fa'; // For the send icon

const Conversation = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser.id;

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setMessages(response.data.messages);
          const userIds = [...new Set(response.data.messages.map((msg) => msg.user_id))];
          await fetchUsers(userIds);
        } else {
          toast.error('Conversation non trouvée.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la conversation:', error.response?.data || error.message);
        toast.error('Erreur lors de la récupération de la conversation.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async (userIds) => {
      try {
        const token = localStorage.getItem('token');
        const usersMap = {};

        for (const userId of userIds) {
          const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          usersMap[userId] = response.data.name;
        }

        setUsers(usersMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error.response?.data || error.message);
        toast.error('Erreur lors de la récupération des utilisateurs.');
      }
    };

    fetchConversation();

    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/messages',
        { conversation_id: conversationId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
      toast.success('Message envoyé avec succès!');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error.response?.data || error.message);
      toast.error("Erreur lors de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="conversation-page">
      {/* Menu (Navbar) */}
      <Menu />

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Conversation Section */}
      <div className="conversation-header">
        <h2>Conversation</h2>
      </div>

      <div className="messages-container">
  {messages.map((message) => {
    const isSentByUser = message.user_id == currentUserId; // Check if it's sent by the current user
    return (
      <div
        key={message.id}
        className={`message ${isSentByUser ? 'sent' : 'received'}`}
      >
        <p>{message.message}</p>
        <div className="message-info">
          <span>
            {users[message.user_id] || 'Utilisateur inconnu'}
          </span>
          <span>{new Date(message.created_at).toLocaleString()}</span>
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef} />
</div>


      <form onSubmit={handleSendMessage} className="send-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
          required
          className="message-input"
        />
        <button type="submit" disabled={sending} className="send-button">
          {sending ? <FaPaperPlane /> : <FaPaperPlane />}
        </button>
      </form>
    </div>
  );
};

export default Conversation;
