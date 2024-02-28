import { type KeycloakOnLoad } from 'keycloak-js';
import config from '@/config.json';

export const keycloakInitOptions = {
  url: config.VUE_APP_KEYCLOAK_HOST_URL,
  realm: config.VUE_APP_KEYCLOAK_REALM,
  clientId: config.VUE_APP_KEYCLOAK_CLIENT_ID,
  onLoad: 'login-required' as KeycloakOnLoad,
};
