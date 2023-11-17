import type { Account, Profile } from '@auth/core/types';
import { getAuthID as getAuthIDKeycloak } from './providers/keycloak.server';
import type { KeycloakProfile } from '@auth/core/providers/keycloak';

export const getAuthID = (account: Account, profile: Profile) => {
	if (!account) throw new Error('No account');

	switch (account.provider) {
		case 'keycloak':
			return getAuthIDKeycloak(profile as KeycloakProfile);
		default:
			throw new Error(`Unknown provider: ${account.provider}`);
	}
};
