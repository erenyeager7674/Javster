<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Javster — Premium Streaming</title>
</svelte:head>

<Navbar categories={data.categories} />
<Sidebar categories={data.categories} />

<!-- Main content area — offset for navbar (4rem top) and sidebar (4rem collapsed → 16rem expanded) -->
<main
	class="bg-background text-foreground min-h-screen pt-16 pl-16 transition-[padding] duration-200"
>
	<div class="page-enter">
		{@render children()}
	</div>
</main>
