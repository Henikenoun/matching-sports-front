import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Important : pour les styles de toast
import { ToastContainer } from 'react-toastify';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      rel="stylesheet"
    />
   <ToastContainer />
    <App />
  </StrictMode>,
)
