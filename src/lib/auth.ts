import { UserManager } from 'oidc-client-ts';
import { browser } from '$app/environment';

// Configuration - update these values or use environment variables
const authority = import.meta.env.PUBLIC_OIDC_AUTHORITY || 'https://example.com';
const client_id = import.meta.env.PUBLIC_OIDC_CLIENT_ID || 'your-client-id';
const redirect_uri =
	import.meta.env.PUBLIC_OIDC_REDIRECT_URI ||
	(browser ? `${window.location.origin}/callback` : 'http://localhost:5173/callback');

const userManager = new UserManager({
	authority,
	client_id,
	redirect_uri,
	response_type: 'code',
	scope: 'openid profile email',
	automaticSilentRenew: true
});

export const login = () => {
	return userManager.signinRedirect();
};

export const logout = () => {
	return userManager.signoutRedirect();
};

export const getUser = () => {
	return userManager.getUser();
};

export const completeLogin = () => {
	return userManager.signinCallback();
};
