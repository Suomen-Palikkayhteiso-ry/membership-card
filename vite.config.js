import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [tailwindcss(), sveltekit()],
	define: {
		'import.meta.env.PUBLIC_OIDC_AUTHORITY': JSON.stringify(process.env.PUBLIC_OIDC_AUTHORITY),
		'import.meta.env.PUBLIC_OIDC_CLIENT_ID': JSON.stringify(process.env.PUBLIC_OIDC_CLIENT_ID),
		'import.meta.env.PUBLIC_OIDC_REDIRECT_URI': JSON.stringify(
			'https://kortti.suomenpalikkayhteiso.fi/callback'
		)
	},
	base: '/'
};

export default config;
