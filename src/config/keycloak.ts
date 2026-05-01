import Keycloak from 'keycloak-js';

const travelAgencyKeycloakServer = import.meta.env.VITE_TRAVELAGENCY_KEYCLOAK_SERVER
const travelAgencyKeycloakPort = import.meta.env.VITE_TRAVELAGENCY_KEYCLOAK_PORT

const keycloakConfig = {
  url: `http://${travelAgencyKeycloakServer}`,
  realm: 'Tingeso',
  clientId: 'frontend-client',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
