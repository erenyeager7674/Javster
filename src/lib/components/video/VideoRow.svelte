<script lang="ts">
	import type { Video } from '$lib/types/index.js';
	import VideoCard from './VideoCard.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		title: string;
		videos: Video[];
		seeAllHref?: string;
		layout?: 'scroll' | 'grid';
		cardLayout?: 'grid' | 'list';
		columns?: 2 | 3 | 4 | 5 | 6;
		showChannel?: boolean;
	}

	let {
		title,
		videos,
		seeAllHref,
		layout = 'scroll',
		cardLayout = 'grid',
		columns = 4,
		showChannel = true
	}: Props = $props();

	let scrollContainer = $state<HTMLDivElement>();

	function scroll(direction: 'left' | 'right') {
		if (!scrollContainer) return;
		const amount = scrollContainer.clientWidth * 0.75;
		scrollContainer.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		});
	}

	function navigateToSeeAll(e: MouseEvent) {
		e.preventDefault();
		if (seeAllHref) {
			goto(seeAllHref);
		}
	}

	const gridCols = {
		2: 'grid-cols-2',
		3: 'grid-cols-2 sm:grid-cols-3',
		4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
		5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
		6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
	};
</script>

<section class="space-y-4">
	<div class="flex items-center justify-between px-1 sm:px-0">
		<div class="flex items-center gap-2">
			<span class="bg-primary h-4 w-1 rounded-full"></span>
			<h2 class="text-foreground text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
		</div>
		{#if seeAllHref}
			<button
				onclick={navigateToSeeAll}
				class="group text-primary inline-flex items-center gap-1 text-xs font-bold transition-colors hover:underline"
			>
				<span>Explore All</span>
				<svg
					class="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					viewBox="0 0 24 24"
					><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
				>
			</button>
		{/if}
	</div>

	{#if layout === 'scroll'}
		<div class="group/row relative">
			<button
				onclick={() => scroll('left')}
				class="border-border bg-card/90 text-foreground hover:border-primary/50 hover:bg-primary/20 hover:text-primary absolute top-1/2 left-0 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover/row:opacity-100 active:scale-95"
				aria-label="Scroll left"
				tabindex="-1"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg
				>
			</button>

			<div
				bind:this={scrollContainer}
				class="scrollbar-hide flex gap-4 overflow-x-auto px-1 py-1 pb-3 sm:px-0"
			>
				{#each videos as video (video.id)}
					<div class="w-60 shrink-0 sm:w-68 md:w-72">
						<VideoCard {video} {showChannel} />
					</div>
				{/each}
			</div>

			<button
				onclick={() => scroll('right')}
				class="border-border bg-card/90 text-foreground hover:border-primary/50 hover:bg-primary/20 hover:text-primary absolute top-1/2 right-0 z-20 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover/row:opacity-100 active:scale-95"
				aria-label="Scroll right"
				tabindex="-1"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
				>
			</button>
		</div>
	{:else}
		<div class="grid gap-x-4 gap-y-6 {gridCols[columns]}">
			{#each videos as video (video.id)}
				<VideoCard {video} layout={cardLayout} {showChannel} />
			{/each}
		</div>
	{/if}
</section>
