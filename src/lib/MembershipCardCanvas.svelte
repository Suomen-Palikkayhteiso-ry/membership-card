<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import type { User } from 'oidc-client-ts';
	interface TokenDetails {
		name: string;
		discord: string;
		bricklink: string;
		effective_date: string;
		expiration_date: string;
	}
	export let user: User | null;
	export let tokenDetails: TokenDetails | null;
	let canvas: HTMLCanvasElement;
	let debouncedDraw: () => void;

	function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
		let timeout: ReturnType<typeof setTimeout>;
		return function (this: unknown, ...args: Parameters<T>) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	onMount(async () => {
		debouncedDraw = debounce(drawCanvas, 250);
		window.addEventListener('resize', debouncedDraw);
		await tick();
		drawCanvas();
	});

	onDestroy(() => {
		if (debouncedDraw) {
			window.removeEventListener('resize', debouncedDraw);
		}
	});

	// Redraw canvas only when user or tokenDetails change
	$: if (canvas && user && tokenDetails) {
		drawCanvas();
	}

	function drawCanvas() {
		if (!canvas || !user || !tokenDetails) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.parentElement!.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = (rect.width / 1.58) * dpr;
		ctx.scale(dpr, dpr);
		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.width / 1.58}px`;
		ctx.fillStyle = '#3887be';
		const cornerRadius = 20 / dpr;
		const width = rect.width;
		const height = rect.height;
		ctx.beginPath();
		ctx.moveTo(cornerRadius, 0);
		ctx.lineTo(width - cornerRadius, 0);
		ctx.quadraticCurveTo(width, 0, width, cornerRadius);
		ctx.lineTo(width, height - cornerRadius);
		ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
		ctx.lineTo(cornerRadius, height);
		ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
		ctx.lineTo(0, cornerRadius);
		ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
		ctx.closePath();
		ctx.fill();
		const baseFontSize = width / 20;
		ctx.font = `700 ${baseFontSize * 1.2}px 'Outfit', sans-serif`;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText('JÄSENKORTTI', width / 2, height * 0.15);
		ctx.font = `400 ${baseFontSize}px 'Outfit', sans-serif`;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'left';
		ctx.fillText(`${tokenDetails?.name}`, width * 0.05, height * 0.3);
		ctx.fillText(`Discord-käyttäjänimi: ${tokenDetails?.discord}`, width * 0.05, height * 0.4);
		ctx.fillText(`Bricklink-tunnus: ${tokenDetails?.bricklink}`, width * 0.05, height * 0.5);
		ctx.fillText(`Liittymispäivä: ${tokenDetails?.effective_date}`, width * 0.05, height * 0.6);
		ctx.fillText(
			`Jäsenyyden päättymispäivä: ${tokenDetails?.expiration_date}`,
			width * 0.05,
			height * 0.7
		);
	}
</script>

<canvas bind:this={canvas} class="border"></canvas>
