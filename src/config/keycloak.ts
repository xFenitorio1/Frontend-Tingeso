// --- PARCHE FINAL PARA HTTP ---
if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
    // 1. UUID para evitar el primer error
    if (!window.crypto.randomUUID) {
        Object.defineProperty(window.crypto, 'randomUUID', {
            value: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            })
        });
    }

    // 2. Engaño para Subtle: Creamos un objeto falso para que no dé TypeError
    // pero no le damos la función 'digest', así Keycloak entiende que no puede usar PKCE
    if (!window.crypto.subtle) {
        Object.defineProperty(window.crypto, 'subtle', {
            value: {},
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
