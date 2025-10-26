<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { getUser, login, logout } from '../lib/auth';
	import type { User } from 'oidc-client-ts';

	let user: User | null = $state(null);
	let canvas: HTMLCanvasElement = $state() as HTMLCanvasElement;
	let tokenDetails: any = null;
	let debouncedDraw: () => void;

	function parseJwt(token: string) {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}

	function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
		let timeout: any;
		return function (this: any, ...args: Parameters<T>) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	onMount(async () => {
		user = await getUser();
		if (user && user.id_token) {
			tokenDetails = parseJwt(user.id_token);
			await tick();
			drawCanvas();

			debouncedDraw = debounce(drawCanvas, 250);
			window.addEventListener('resize', debouncedDraw);
		}
	});

	onDestroy(() => {
		if (debouncedDraw) {
			window.removeEventListener('resize', debouncedDraw);
		}
	});

	function drawCanvas() {
		if (!canvas || !user) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.parentElement!.getBoundingClientRect();

		canvas.width = rect.width * dpr;
		canvas.height = (rect.width / 16) * 9 * dpr; // Maintain 16:9 aspect ratio

		ctx.scale(dpr, dpr);

		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${(rect.width / 16) * 9}px`;

		// Clear canvas
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const baseFontSize = rect.width / 20;

		// Set font
		ctx.font = `700 ${baseFontSize * 1.2}px 'Outfit', sans-serif`;
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';

		// Draw text
		ctx.fillText('MEMBERSHIP CARD', rect.width / 2, baseFontSize * 2);

		ctx.font = `400 ${baseFontSize}px 'Outfit', sans-serif`;
		ctx.textAlign = 'left';

		ctx.fillText(`Name: ${tokenDetails.name}`, 25, baseFontSize * 5);
		ctx.fillText(`Effective Date: ${user.profile.effective_date}`, 25, baseFontSize * 7);
		ctx.fillText(`Expiration Date: ${user.profile.expiration_date}`, 25, baseFontSize * 9);
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-full rounded-lg bg-white p-8 shadow-xl">
		{#if user}
			<div class="space-y-6">
				<canvas bind:this={canvas} class="w-full rounded-lg border"></canvas>
				<button
					onclick={logout}
					class="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-red-700"
				>
					Logout
				</button>
			</div>
		{:else}
			<div class="space-y-6 text-center">
				<p class="text-lg text-gray-600">Please login to view your membership card</p>
				<button
					onclick={login}
					class="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-indigo-700"
				>
					Login with OIDC
				</button>
			</div>
		{/if}
	</div>
</div>
