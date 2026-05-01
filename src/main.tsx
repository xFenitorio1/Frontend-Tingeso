import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './config/keycloak'
import { AuthProvider } from './components/auth/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactKeycloakProvider 
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false,
        flow: 'standard'
      }}
      onEvent={(event, error) => {
        console.log('Keycloak Event:', event, 'Error:', error);
        }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactKeycloakProvider>
  </StrictMode>,
)