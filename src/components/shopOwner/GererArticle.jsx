import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FaEdit, FaTrash, FaTag, FaGift, FaInfoCircle } from 'react-icons/fa';
import Select from 'react-select';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const GererArticle = ({ categoryId, shopId }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [articleDetails, setArticleDetails] = useState({
        ref: '',
        name: '',
        desc: '',
        photo: '',
        quantity: '',
        price: '',
        couleurs: [], // Ensure this is always an array
        remise: '',
        offreB: false,
        offre: '', // Added for offer description
        categorie_id: categoryId,
        shop_id: shopId
    });
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [deleteArticleId, setDeleteArticleId] = useState(null);
    const [newColor, setNewColor] = useState('');

    const fetchArticles = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/articles');
            setArticles(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();

    }, []);

    const handleEdit = (article) => {
        setArticleDetails({
            ...article,
            couleurs: JSON.parse(article.couleur) ? JSON.parse(article.couleur) : [] ,
            offreB:article.offre
        });
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/articles/${deleteArticleId}`);
            fetchArticles();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (articleDetails.id) {
                await axios.put(`http://127.0.0.1:8000/api/articles/${articleDetails.id}`, articleDetails);
            } else {
                await axios.post('http://127.0.0.1:8000/api/articles', articleDetails);
            }
            setShowModal(false);
            fetchArticles();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'article', error);
        }
    };

    const handleAddColor = () => {
        if (newColor && !articleDetails.couleurs.includes(newColor)) {
            setArticleDetails({
                ...articleDetails,
                couleurs: [...articleDetails.couleurs, newColor]
            });
            setNewColor('');
        }
    };

    const colorOptions = articleDetails.couleurs.map(color => ({
        value: color,
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                    style={{
                        display: 'inline-block',
                        width: 20,
                        height: 20,
                        backgroundColor: color,
                        marginRight: 10
                    }}
                ></span>
                {color}
            </div>
        )
    }));

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
                    setArticleDetails((prevDetails) => ({
                        ...prevDetails,
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-circle"></div>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    return (
        <div className="article-container">
            <h2 className='recent-Articles ' style={{marginLeft:"-600px"}}>Articles</h2>
            
            <div className="article-list row bg-light p-5 rounded-5">
                {articles.map((article) => (
                    <div key={article.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-header">
                                {article.photo && (
                                    <img src={article.photo} alt={article.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{article.name}</h5>
                                <p className="card-text">{article.desc}</p>
                                <div className="d-flex justify-content-between">
                                    <Button className="bg-secondary btn-sm " onClick={() => handleEdit(article)}>
                                        <FaEdit />
                                    </Button>
                                    <Button className="bg-danger" onClick={() => {
                                        setDeleteArticleId(article.id);
                                        setShowDeleteModal(true);
                                    }}>
                                        <FaTrash />
                                    </Button>
                                    <Button className="bg-warning" onClick={() => {
                                        setSelectedArticle(article);
                                        setShowDetailsModal(true);
                                    }}>
                                        <FaInfoCircle />
                                    </Button>
                                </div>
                                {article.remise!=0 && (
                                    <div className="mt-2 text-info">
                                        <FaTag /> Remise: {article.remise}%
                                    </div>
                                )}
                                {article.offre && (
                                    <div className="mt-2 text-danger">
                                        <FaGift /> Offre: {article.offre}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{articleDetails.id ? 'Editer Article' : 'Ajouter Article'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Référence</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the article reference"
                                value={articleDetails.ref}
                                onChange={(e) => setArticleDetails({ ...articleDetails, ref: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the article name"
                                value={articleDetails.name}
                                onChange={(e) => setArticleDetails({ ...articleDetails, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter the article description"
                                value={articleDetails.desc}
                                onChange={(e) => setArticleDetails({ ...articleDetails, desc: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Photo</Form.Label>
                            <FilePond
                                files={files}
                                acceptedFileTypes="image/*"
                                onupdatefiles={setFiles}
                                allowMultiple={false}
                                server={serverOptions}
                                name="photo"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantité</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter the article quantity"
                                value={articleDetails.quantity}
                                onChange={(e) => setArticleDetails({ ...articleDetails, quantity: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Prix</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter the article price"
                                value={articleDetails.price}
                                onChange={(e) => setArticleDetails({ ...articleDetails, price: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Couleurs</Form.Label>
                            <Select
                                isMulti
                                options={colorOptions}
                                value={articleDetails.couleurs.map(color => ({ value: color, label: color }))}
                                onChange={(selectedOptions) => setArticleDetails({
                                    ...articleDetails,
                                    couleurs: selectedOptions.map(option => option.value)
                                })}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Add new color"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                className="mt-2"
                            />
                            <Button variant="secondary" onClick={handleAddColor} className="mt-2">Add Color</Button>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Remise</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter the article discount"
                                value={articleDetails.remise}
                                onChange={(e) => setArticleDetails({ ...articleDetails, remise: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Offre"
                                checked={articleDetails.offreB}
                                onChange={(e) => setArticleDetails({ ...articleDetails, offreB: e.target.checked })}
                            />
                        </Form.Group>
                        {articleDetails.offreB && (
                            <Form.Group className="mb-3">
                                <Form.Label>Description de l'offre</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter the offer description"
                                    value={articleDetails.offre}
                                    onChange={(e) => setArticleDetails({ ...articleDetails, offre: e.target.value })}
                                />
                            </Form.Group>
                        )}
                        <Button variant="success" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                        <Button variant="danger" onClick={handleDelete} className="ms-2">Supprimer</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedArticle && (
                        <div>
                            <p><strong>Référence:</strong> {selectedArticle.ref}</p>
                            <p><strong>Nom:</strong> {selectedArticle.name}</p>
                            <p><strong>Description:</strong> {selectedArticle.desc}</p>
                            <p><strong>Quantité:</strong> {selectedArticle.quantity}</p>
                            <p><strong>Prix:</strong> {selectedArticle.price}</p>
                            <p><strong>Couleurs:</strong> {JSON.parse(selectedArticle.couleur).join(', ')}</p>
                            {selectedArticle.remise && (
                                <p><strong>Remise:</strong> {selectedArticle.remise}%</p>
                            )}
                            {selectedArticle.offre && (
                                <p><strong>Offre:</strong> {selectedArticle.offre}</p>
                            )}
                            {selectedArticle.photo && (
                                <img src={selectedArticle.photo} alt={selectedArticle.name} className="img-fluid mt-2" />
                            )}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <Button style={{marginTop:'-50px'}} className="bg-success w-25 float-end " onClick={() => setShowModal(true)}>Ajouter Article</Button>
        </div>
    );
};

export default GererArticle;