import { env } from '$env/dynamic/private';

import type {  OIDCUserConfig } from '@auth/core/providers';
import Auth0, { type Auth0Profile } from '@auth/core/providers/auth0';

export const getAuth0Provider = () => {
	if (
		!env.AUTH_PROVIDER_AUTH0__CLIENT_ID ||
		!env.AUTH_PROVIDER_AUTH0__CLIENT_SECRET ||
		!env.AUTH_PROVIDER_AUTH0__ISSUER
	) {
		throw new Error('Missing AUTH0 environment variables');
	}
 
    
	const config: OIDCUserConfig<Auth0Profile> = {
		issuer: process.env.AUTH_PROVIDER_AUTH0__ISSUER,
		clientId: process.env.AUTH_PROVIDER_AUTH0__CLIENT_ID,
		clientSecret: process.env.AUTH_PROVIDER_AUTH0__CLIENT_SECRET
	};

	if (env.AUTH_PROVIDER_AUTH0__WELL_KNOWN) {
		config.wellKnown = env.AUTH_PROVIDER_AUTH0__WELL_KNOWN;
	}

	return Auth0(config);
};

export const getAuthID = (profile: Auth0Profile) => {
	return profile.sid;
};
