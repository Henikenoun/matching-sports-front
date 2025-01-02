import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Category = ({ setShowCategory, setShowGererArticle, setSelectedCategoryId, setSelectedShopId, shopId }) => {
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [categoryDetails, setCategoryDetails] = useState({
        name: '',
        desc: '',
        photo: '',
    });
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories', error);
        }
    };

    const fetchArticles = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/articles');
            setArticles(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchArticles();
    }, []);

    const handleEdit = (category) => {
        setCategoryDetails(category);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/categories/${deleteCategoryId}`);
            fetchCategories();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const updatedCategoryDetails = {
                ...categoryDetails,
                desc: `${categoryDetails.desc} (Shop ID: ${shopId})`,
            };
            if (categoryDetails.id) {
                await axios.put(`http://127.0.0.1:8000/api/categories/${categoryDetails.id}`, updatedCategoryDetails);
            } else {
                await axios.post('http://127.0.0.1:8000/api/categories', updatedCategoryDetails);
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la catégorie', error);
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
                    setCategoryDetails((prevDetails) => ({
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

    // Filter categories based on articles that belong to the shop or have the shop ID in their description
    const filteredCategories = categories.filter(category =>
        articles.some(article => article.shop_id === shopId && article.categorie_id === category.id) ||
        category.desc.includes(`(Shop ID: ${shopId})`)
    );
    return (
        <div className="category-container">
            <h2 className='recent-Articles' style={{marginLeft:"-600px"}}>Catégories</h2>
            
            <div className="category-list row bg-light p-5 rounded-5">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-header">
                                {category.photo && (
                                    <img src={category.photo} alt={category.name} className="card-img-top" />
                                )}
                            </div>
                            <div className="card-body">
                                <p className="card-text"><strong>Nom de categorie : </strong>{category.name}</p>
                                <p className="card-text"><strong>Description : </strong>{category.desc.replace(` (Shop ID: ${shopId})`, '')}</p>
                                <div className="d-flex justify-content-between">
                                    <Button className="bg-warning" onClick={() => handleEdit(category)}>
                                        <FaEdit /> Edit
                                    </Button>
                                    <Button className="bg-danger" onClick={() => {
                                        setDeleteCategoryId(category.id);
                                        setShowDeleteModal(true);
                                    }}>
                                        <FaTrash /> Delete
                                    </Button>
                                </div>
                                <Button className="bg-success mt-2" onClick={() => {
                                    setSelectedCategoryId(category.id);
                                    setSelectedShopId(shopId);
                                    setShowCategory(false);
                                    setShowGererArticle(true);
                                }}>
                                    <FaPlus /> Add Article
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{categoryDetails.id ? 'Editer Catégorie' : 'Ajouter Catégorie'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the category name"
                                value={categoryDetails.name}
                                onChange={(e) => setCategoryDetails({ ...categoryDetails, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter the category description"
                                value={categoryDetails.desc}
                                onChange={(e) => setCategoryDetails({ ...categoryDetails, desc: e.target.value })}
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
                    <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                        <Button variant="danger" onClick={handleDelete} className="ms-2">Supprimer</Button>
                    </div>
                </Modal.Body>
            </Modal>
        <Button className="bg-primary w-25 float-end" style={{marginTop:"-50px"}} onClick={() => setShowModal(true)}>Ajouter Catégorie</Button>
            
        </div>
        
    );
};

export default Category;