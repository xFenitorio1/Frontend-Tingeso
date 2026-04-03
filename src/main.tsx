import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 👇 IMPORTA TU CONFIG
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './config/keycloak'
import { AuthProvider } from './components/auth/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactKeycloakProvider authClient={keycloak}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactKeycloakProvider>
  </StrictMode>,
)