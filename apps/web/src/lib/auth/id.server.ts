import type { Account, Profile } from '@auth/core/types';
import { getAuthID as getAuthIDKeycloak } from './providers/keycloak.server';
import { getAuthID as getAuthIDAUth0 } from './providers/auth0.server';
import type { KeycloakProfile } from '@auth/core/providers/keycloak';
import type { Auth0Profile } from '@auth/core/providers/auth0';

export const getAuthID = (account: Account, profile: Profile) => {
	if (!account) throw new Error('No account');

	switch (account.provider) {
		case 'keycloak':
			return getAuthIDKeycloak(profile as KeycloakProfile);
		case 'auth0':
			return getAuthIDAUth0(profile as Auth0Profile);
		default:
			throw new Error(`Unknown provider: ${account.provider}`);
	}
};
