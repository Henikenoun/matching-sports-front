import React, { useState } from 'react';
import AfficheReservations from './AfficheReservations';
import AfficheAbonnements from './AfficheAbonnements';
import AjouterTerrain from './AjouterTerrain';

  // Composant fictif pour Reports
import './Admin.css';
import Shop from '../shopOwner/Shop';

const OwnerDashboard = () => {
    // État pour gérer l'option active (Réservations, Abonnements, Settings, etc.)
    const [activeTab, setActiveTab] = useState('reservations'); // Par défaut 'reservations'

    // Fonction pour gérer le clic sur les options du menu
    const handleTabClick = (tab) => {
        setActiveTab(tab); // Change l'onglet actif
    };

    return (
        <div className="admin-dashboard">
            {/* Header Section */}
            <header>
                <div className="logosec">
                    <div className="logo">SPORTISSIMO</div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                        className="icn menuicn"
                        alt="menu-icon"
                    />
                </div>
                {/* Search bar */}
                <div className="searchbar">
                    <input type="text" placeholder="Search" />
                    <div className="searchbtn">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                            className="icn srchicn"
                            alt="search-icon"
                        />
                    </div>
                </div>
            </header>

            <div className="main-container">
                {/* Sidebar Section */}
                <div className="navcontainer">
                    <nav className="nav">
                        <div className="nav-upper-options">
                            <div
                                className="option2 nav-option"
                                onClick={() => handleTabClick('#')}
                            >
                                <i className="fas fa-calendar-alt nav-img"></i>
                                <h3>details</h3>
                            </div>
                            <div
                                className="nav-option option4"
                                onClick={() => handleTabClick('reservations')}
                            >
                                <i className="fas fa-dumbbell nav-img"></i>
                                <h3>reservations</h3>
                            </div>

                            <div
                                className="nav-option option3"
                                onClick={() => handleTabClick('shops')}
                            >
                                <i className="fas fa-chart-bar nav-img"></i>
                                <h3>shops</h3>
                            </div>
                            <div className="nav-option logout">
                                <i className="fas fa-sign-out-alt nav-img"></i>
                                <h3>Logout</h3>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className="main">
                    {/* Affichage des données en fonction de l'onglet sélectionné */}
                    {activeTab === 'reservations' && <AfficheReservations />}
                    {activeTab === 'shops' && <Shop />}
                    {activeTab === 'abonnements' && <AfficheAbonnements />}
                    
                    {activeTab === 'AjouterTerrain' && <AjouterTerrain />}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
