import Keycloak from 'keycloak-js';

const travelAgencyKeycloakServer = import.meta.env.VITE_TRAVELAGENCY_KEYCLOAK_SERVER


const keycloakConfig = {
  url: `http://${travelAgencyKeycloakServer}`,
  realm: 'Tingeso',
  clientId: 'frontend-client',
};

const keycloak = new Keycloak(keycloakConfig);
(window as any).keycloak = keycloak; // <--- ESTO expone el objeto a la consola

export default keycloak;
