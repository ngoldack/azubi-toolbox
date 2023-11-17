import { env } from '$env/dynamic/private';
import type { Provider } from '@auth/core/providers';
import { getKeycloakProvider } from './providers/keycloak.server';

export const getProviders = () => {
	const providers = Array<Provider>();

	if (env.AUTH_PROVIDER_KEYCLOAK__ENABLED) providers.push(getKeycloakProvider());

	return providers;
};
