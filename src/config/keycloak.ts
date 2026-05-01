// --- INICIO DEL PARCHE PARA HTTP ---
if (typeof window !== 'undefined' && !window.crypto.randomUUID) {
  Object.defineProperty(window.crypto, 'randomUUID', {
    value: () => {
      return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
  });
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
