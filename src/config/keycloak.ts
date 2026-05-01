// --- PARCHE DE EMERGENCIA PARA HTTP ---
if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
    // 1. UUID para evitar el error de generación de IDs
    if (!window.crypto.randomUUID) {
        Object.defineProperty(window.crypto, 'randomUUID', {
            value: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            })
        });
    }

    // 2. Parchear Subtle y Digest para evitar el crash de PKCE
    if (!window.crypto.subtle || Object.keys(window.crypto.subtle).length === 0) {
        const fakeSubtle = {
            digest: () => new Promise((resolve) => {
                // Devolvemos un buffer vacío para que la librería no pueda generar el challenge
                resolve(new ArrayBuffer(0));
            })
        };

        Object.defineProperty(window.crypto, 'subtle', {
            value: fakeSubtle,
            configurable: true,
            writable: true
        });
    }
}

import Keycloak from 'keycloak-js';

const travelAgencyKeycloakServer = import.meta.env.VITE_TRAVELAGENCY_KEYCLOAK_SERVER

const keycloakConfig = {
  url: `http://${travelAgencyKeycloakServer}`,
  realm: 'Tingeso',
  clientId: 'frontend-client',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
