import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';
import { getKeycloakProvider } from './providers/keycloak.server';
import { getAuth0Provider } from './providers/auth0.server';

export const getProviders = () => {
	const providers = Array<Provider>();

	if (env.AUTH_PROVIDER_KEYCLOAK__ENABLED) providers.push(getKeycloakProvider());
    if (env.AUTH_PROVIDER_AUTH0__ENABLED) providers.push(getAuth0Provider());

	return providers;
};
