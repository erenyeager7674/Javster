<script lang="ts">
	import { page } from '$app/stores';
	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'Something went wrong');
</script>

<svelte:head>
	<title>{status} — Javster</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4" style="background:#0e0e10; color:#f0f0f8;">
	<div class="w-full max-w-lg text-center">
		<!-- Error code -->
		<p class="text-8xl font-extrabold sm:text-9xl" style="color:#2a2a34;">{status}</p>
		<h1 class="mt-4 text-2xl font-bold" style="color:#f0f0f8;">
			{status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
		</h1>
		<p class="mt-2 text-sm" style="color:#8080a0;">
			{status === 404
				? "The page you're looking for doesn't exist or has been removed."
				: message}
		</p>

		<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a href="/"
				class="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
				style="background:#6d28d9;">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
				</svg>
				Go Home
			</a>
			<a href="/browse/trending"
				class="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-95"
				style="border:1px solid #2a2a34; background:#16161a; color:#c0c0d0;">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
				</svg>
				Browse Trending
			</a>
		</div>
	</div>
</div>
