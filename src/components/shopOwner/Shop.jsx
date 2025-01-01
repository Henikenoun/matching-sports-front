import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Pag.css';
import Category from './Categorie';
import GererArticle from './GererArticle';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Shop = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [showGererArticle, setShowGererArticle] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [files, setFiles] = useState([]);
    const [shopDetails, setShopDetails] = useState({
        id: null,
        name: '',
        desc: '',
        photos: [],
    });

    const fetchShops = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/shops');
            const data = response.data.map(shop => ({
                ...shop,
                photos: typeof shop.photos === 'string' ? JSON.parse(shop.photos) : shop.photos,
            }));
            // data.filter(shop => shop.club_id === (localStorage.getItem('user')).club_id);
            setShops(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des shops', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
        
    }, []);

    const handleEdit = (shop) => {
        setSelectedShop(shop);
        setShopDetails({
            id:shop.id,
            name: shop.name,
            desc: shop.desc,
            photos: shop.photos || [],
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://127.0.0.1:8000/api/shops/${selectedShop.id}`, {
                name: shopDetails.name,
                desc: shopDetails.desc,
                photos: JSON.stringify(shopDetails.photos),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowModal(false);
            fetchShops();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du shop", error);
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
                    setShopDetails((prevDetails) => ({
                        ...prevDetails,
                        photos: [...prevDetails.photos, data.url],
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 1000,
        nextArrow: <div className="slick-next slick-arrow" />,
        prevArrow: <div className="slick-prev slick-arrow" />,
    };

    return (
        <div className="report-container p-5">
            {showCategory ? (
                <div>
                    <Button variant="bg-primary w-25 float-end" onClick={() => setShowCategory(false)}>Retour</Button>
                    <Category
                        setShowCategory={setShowCategory}
                        setShowGererArticle={setShowGererArticle}
                        setSelectedCategoryId={setSelectedCategoryId}
                        setSelectedShopId={setSelectedShopId}
                        shopId={shops[0].id ? shops[0].id : null}
                    />
                </div>
            ) : showGererArticle ? (
                <div>
                    <Button variant="bg-primary w-25 float-end"  onClick={() => setShowGererArticle(false)}>Retour</Button>
                    <GererArticle
                        categoryId={selectedCategoryId}
                        shopId={selectedShopId}
                    />
                </div>
            ) : (
                <div>
                    <div className="report-header">
                        <h1 className="recent-Articles">Shops</h1>
                    </div>

                    <div className="report-body">
                        <Button className="bg-warning w-25 float-end" onClick={() => setShowCategory(true)}>Gérer les Catégories</Button><br></br><br></br><br></br>
                        <div className="card-container">
                            {shops.map((shop, idx) => (
                                <div key={idx} className="card">
                                    <div className="card-header" style={{ height: '400px' }}>
                                        {shop.photos && Array.isArray(shop.photos) && shop.photos.length > 0 && (
                                            <Slider {...sliderSettings}>
                                                {shop.photos.map((photo, index) => (
                                                    <div key={index}>
                                                        <img src={photo} alt={shop.name} className="card-img-top" />
                                                    </div>
                                                ))}
                                            </Slider>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title recent-Articles text-uppercase">{shop.name}</h5>
                                        <p className="card-text"><strong className='text-secondary'>Description</strong> : {shop.desc}</p>
                                        <Button variant="secondary" className='w-25 float-end bg-warning' onClick={() => handleEdit(shop)}>Edit</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Shop</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSave}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Photos</Form.Label>
                                    <FilePond
                                        files={files}
                                        acceptedFileTypes="image/*"
                                        onupdatefiles={setFiles}
                                        allowMultiple={true}
                                        server={serverOptions}
                                        name="photos"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the shop name"
                                        value={shopDetails.name}
                                        onChange={(e) => setShopDetails({ ...shopDetails, name: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter the shop description"
                                        value={shopDetails.desc}
                                        onChange={(e) => setShopDetails({ ...shopDetails, desc: e.target.value })}
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit">
                                    Save
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Shop;