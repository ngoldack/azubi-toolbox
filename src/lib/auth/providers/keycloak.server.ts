import { env } from '$env/dynamic/private';
import type { OAuthUserConfig } from '@auth/core/providers';
import Keycloak, { type KeycloakProfile } from '@auth/core/providers/keycloak';

export const getKeycloakProvider = () => {
	if (
		!env.AUTH_PROVIDER_KEYCLOAK__CLIENT_ID ||
		!env.AUTH_PROVIDER_KEYCLOAK__CLIENT_SECRET ||
		!env.AUTH_PROVIDER_KEYCLOAK__ISSUER
	) {
		throw new Error('Missing Keycloak environment variables');
	}

	const config: OAuthUserConfig<KeycloakProfile> = {
		issuer: env.AUTH_PROVIDER_KEYCLOAK__ISSUER,
		clientId: env.AUTH_PROVIDER_KEYCLOAK__CLIENT_ID,
		clientSecret: env.AUTH_PROVIDER_KEYCLOAK__CLIENT_SECRET
	};

	if (env.AUTH_PROVIDER_KEYCLOAK__WELL_KNOWN) {
		config.wellKnown = env.AUTH_PROVIDER_KEYCLOAK__WELL_KNOWN;
	}

	return Keycloak(config);
};

export const getAuthID = (profile: KeycloakProfile) => {
	return profile.preferred_username;
};
