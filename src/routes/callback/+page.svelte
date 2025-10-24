<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { completeLogin } from '../../lib/auth';

	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			await completeLogin();
			goto('/');
		} catch (e) {
			console.error('Login error:', e);
			error = e instanceof Error ? e.message : 'Authentication failed';
		}
	});
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
		{#if error}
			<div class="text-red-600">
				<h1 class="mb-4 text-2xl font-bold">Authentication Error</h1>
				<p class="mb-4">{error}</p>
				<a href="/" class="text-indigo-600 underline hover:text-indigo-800"> Return to home </a>
			</div>
		{:else}
			<div class="space-y-4">
				<div
					class="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"
				></div>
				<p class="text-lg text-gray-600">Completing login...</p>
			</div>
		{/if}
	</div>
</div>
