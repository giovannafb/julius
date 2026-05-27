import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './Login';
import Usuario from './Usuario';
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Usuario />
  </StrictMode>
)
