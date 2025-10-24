<script lang="ts">
	import { onMount } from 'svelte';
	import { getUser, login, logout } from '../lib/auth';
	import type { User } from 'oidc-client-ts';

	let user: User | null = $state(null);

	onMount(async () => {
		user = await getUser();
	});
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
		<h1 class="mb-6 text-center text-3xl font-bold text-gray-800">Membership Card</h1>

		{#if user}
			<div class="space-y-6">
				<div class="border-b pb-4">
					<h2 class="mb-4 text-xl font-semibold text-gray-700">User Profile</h2>
					<div class="rounded-lg bg-gray-50 p-4">
						<pre class="overflow-x-auto text-sm text-gray-700">{JSON.stringify(
								user.profile,
								null,
								2
							)}</pre>
					</div>
				</div>

				{#if user.id_token}
					<div class="border-b pb-4">
						<h2 class="mb-4 text-xl font-semibold text-gray-700">ID Token</h2>
						<div class="rounded-lg bg-gray-50 p-4">
							<pre class="overflow-x-auto text-xs break-all text-gray-600">{user.id_token}</pre>
						</div>
					</div>
				{/if}

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
