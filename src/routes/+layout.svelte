<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Javster — Premium Streaming</title>
</svelte:head>

<Navbar categories={data.categories} />

<!-- Sidebar: desktop only -->
<Sidebar categories={data.categories} />

<!-- Bottom nav: mobile only -->
<BottomNav categories={data.categories} />

<!--
	Main content:
	- Desktop: pl-16 to clear collapsed sidebar, pt-16 to clear navbar
	- Mobile:  no left padding (sidebar hidden), pb-14 to clear bottom nav
-->
<main
	class="min-h-screen pt-16 pl-0 pb-14 md:pl-16 md:pb-0 transition-[padding] duration-200"
	style="background:#0e0e10;"
>
	<div class="page-enter">
		{@render children()}
	</div>
</main>
