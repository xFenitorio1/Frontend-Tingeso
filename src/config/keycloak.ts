import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:9090',
  realm: 'Tingeso',
  clientId: 'frontend-client',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
