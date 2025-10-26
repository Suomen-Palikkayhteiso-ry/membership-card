<script lang="ts">
	import '../lib/fonts.css';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	let { children } = $props();
</script>

{@render children()}
