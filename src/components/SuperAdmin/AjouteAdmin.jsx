import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import './AjouteAdmin.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AjouteAdmin = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'owner',
        date_of_birth: '',
        city: '',
        phone_number: '',
        photo: '',
        availability: 1,
        transport: 0,
        club_id: '', // ID sélectionné depuis le menu déroulant
        isActive: 1,
    });

    const [clubs, setClubs] = useState([]); // Liste des clubs
    const [loading, setLoading] = useState(true); // État de chargement
    const [files, setFiles] = useState([]); // État pour stocker les fichiers

    const villesDisponibles = [
        'Tunis', 'Sfax', 'Sousse', 'Benzart', 'Gabès', 'Ariana', 'Nabeul', 'Monastir', 'Mahdia', 'Sidi Bouzid', 'Kairouan'
    ];

    // Récupérer la liste des clubs au chargement du composant
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/clubs');
                setClubs(response.data); // Supposons que l'API retourne un tableau de clubs
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des clubs:', error);
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/register', formData);
            alert('Admin ajouté avec succès !');
        } catch (error) {
            alert('Erreur lors de l’ajout de l’admin.');
        }
    };

    const serverOptions = {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'frontend');
            data.append('cloud_name', 'dea3u12iy');
            data.append('publicid', file.name);

            axios.post('https://api.cloudinary.com/v1_1/dea3u12iy/image/upload', data)
                .then((response) => response.data)
                .then((data) => {
                    setFormData((prevData) => ({
                        ...prevData,
                        photo: data.url,
                    }));
                    load(data);
                })
                .catch((err) => {
                    console.error('Error uploading file:', err);
                    error('Upload failed');
                    abort();
                });
        },
    };

    return (
        <div className="form-container">
            <h2>Ajouter un Responsable Club</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Prénom :</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email :</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirmation du mot de passe :</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date de naissance :</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ville :</label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Sélectionner une ville --</option>
                        {villesDisponibles.map((ville, idx) => (
                            <option key={idx} value={ville}>
                                {ville}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Numéro de téléphone :</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group" >
                    <label>Photo :</label>
                    <FilePond
                        files={files}
                        acceptedFileTypes="image/*"
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        server={serverOptions}
                        name="photo"
                    />
                </div>
                <div className="form-group">
                    <label>Club :</label>
                    <select
                        name="club_id"
                        value={formData.club_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Sélectionner un club --</option>
                        {loading ? (
                            <option disabled>Chargement des clubs...</option>
                        ) : (
                            clubs.map((club) => (
                                <option key={club.id} value={club.id}>
                                    {club.nom}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div className="button-container">
                    <button type="submit">Ajouter</button>
                </div>
                <p className="note">Tous les champs sont obligatoires.</p>
            </form>
        </div>
    );
};

export default AjouteAdmin;
