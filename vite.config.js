import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [tailwindcss(), sveltekit()],
	base: '/',
	envPrefix: 'VITE_'
};

export default config;
