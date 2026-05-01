// --- PARCHE DEFINITIVO PARA HTTP ---
if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
    // 1. Arreglamos el UUID
    if (!window.crypto.randomUUID) {
        Object.defineProperty(window.crypto, 'randomUUID', {
            value: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            })
        });
    }

    // 2. Engañamos a Keycloak: si no hay HTTPS, "borramos" subtle 
    // para que la librería entienda que no puede usar PKCE
    if (window.crypto && (window.crypto as any).subtle) {
        Object.defineProperty(window.crypto, 'subtle', {
            value: undefined,
            configurable: true
        });
    }
}
// --- FIN DEL PARCHE ---

import Keycloak from 'keycloak-js';

const travelAgencyKeycloakServer = import.meta.env.VITE_TRAVELAGENCY_KEYCLOAK_SERVER

const keycloakConfig = {
  url: `http://${travelAgencyKeycloakServer}`,
  realm: 'Tingeso',
  clientId: 'frontend-client',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
