<script lang="ts">
	import { getUser, login, logout } from '../lib/auth';
	import MembershipCardCanvas from '../lib/MembershipCardCanvas.svelte';
	import LogoutButton from '../lib/LogoutButton.svelte';
	import LoginPrompt from '../lib/LoginPrompt.svelte';
	import type { User } from 'oidc-client-ts';

	interface TokenDetails {
		name: string;
		discord: string;
		bricklink: string;
		effective_date: string;
		expiration_date: string;
	}

	let user: User | null = $state(null);
	let tokenDetails: TokenDetails | null = $state(null);

	function parseJwt(token: string): TokenDetails {
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

	import { onMount } from 'svelte';
	onMount(async () => {
		user = await getUser();
		if (user && user.id_token) {
			tokenDetails = parseJwt(user.id_token);
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-[#200e3a] p-4 pt-[5vw]">
	<div class="w-[90vw] max-w-full rounded-xl bg-white shadow-xl">
		{#if user}
			<div class="relative space-y-6">
				<LogoutButton {logout} />
				<MembershipCardCanvas {user} {tokenDetails} />
			</div>
		{:else}
			<LoginPrompt {login} />
		{/if}
	</div>
</div>
