import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import './index.css'
import {App} from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CarritoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
