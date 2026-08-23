<script lang="ts">
	import type { Video } from '$lib/types/index.js';
	import { formatViews, formatDuration } from '$lib/types/index.js';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	interface Props {
		videos: Video[];
	}

	let { videos }: Props = $props();

	let current = $state(0);
	let transitioning = $state(false);
	let progressIntervalId: ReturnType<typeof setInterval> | undefined;
	let progress = $state(0);
	let isPaused = $state(false);

	const SLIDE_DURATION = 8000;
	const TICK = 60;

	const total = $derived(videos.length);
	const video = $derived(videos[current]);

	function goTo(index: number) {
		if (transitioning) return;
		transitioning = true;
		setTimeout(() => {
			current = (index + total) % total;
			progress = 0;
			transitioning = false;
		}, 300);
	}

	function next() {
		goTo(current + 1);
	}
	function prev() {
		goTo(current - 1);
	}

	function startTimer() {
		stopTimer();
		progress = 0;
		progressIntervalId = setInterval(() => {
			if (!isPaused) {
				progress += (TICK / SLIDE_DURATION) * 100;
				if (progress >= 100) next();
			}
		}, TICK);
	}

	function stopTimer() {
		if (progressIntervalId) {
			clearInterval(progressIntervalId);
			progressIntervalId = undefined;
		}
	}

	onMount(() => startTimer());
	onDestroy(() => stopTimer());
</script>

<!-- ── Full-bleed Cinematic Hero ── -->
<div
	class="relative w-full overflow-hidden rounded-2xl bg-black"
	style="aspect-ratio: 21/9; min-height: 420px;"
	onmouseenter={() => (isPaused = true)}
	onmouseleave={() => (isPaused = false)}
	role="region"
	aria-label="Featured videos"
>
	<!-- Slide backgrounds (crossfade) -->
	{#each videos as v, i (v.id)}
		<div
			class="absolute inset-0 transition-opacity duration-700 ease-in-out {i === current
				? 'z-10 opacity-100'
				: 'z-0 opacity-0'}"
			aria-hidden={i !== current}
		>
			<img
				src={v.thumbnailUrl}
				alt=""
				class="h-full w-full object-cover object-center brightness-75"
				loading={i === 0 ? 'eager' : 'lazy'}
				fetchpriority={i === 0 ? 'high' : 'auto'}
				width="1920"
				height="816"
			/>
		</div>
	{/each}

	<!-- Gradient overlays -->
	<div class="pointer-events-none absolute inset-0 z-20">
		<!-- Left dark gradient for text readability -->
		<div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
		<!-- Bottom fade to blend into page -->
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
		></div>
		<!-- Top subtle shadow -->
		<div
			class="absolute top-0 right-0 left-0 h-24 bg-gradient-to-b from-black/40 to-transparent"
		></div>
	</div>

	<!-- ── Foreground Content ── -->
	<div class="absolute inset-0 z-30 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
		<!-- Meta tags row -->
		<div class="mb-3 flex flex-wrap items-center gap-2">
			{#if video?.isLive}
				<span
					class="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
				>
					<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>LIVE
				</span>
			{/if}
			{#if video?.isHd}
				<span
					class="rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white/90 uppercase backdrop-blur-sm"
					>HD</span
				>
			{/if}
			{#if video?.category && video.category !== 'Uncategorized'}
				<span
					class="bg-primary/80 rounded px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
				>
					{video.category}
				</span>
			{/if}
			{#if video?.duration}
				<span
					class="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-sm"
				>
					{formatDuration(video.duration)}
				</span>
			{/if}
		</div>

		<!-- Title -->
		<h1
			class="line-clamp-2 max-w-2xl text-2xl leading-tight font-extrabold tracking-tight text-white drop-shadow-lg transition-all duration-300 sm:text-3xl lg:text-4xl {transitioning
				? 'translate-y-2 opacity-0'
				: 'translate-y-0 opacity-100'}"
		>
			{video?.title ?? ''}
		</h1>

		<!-- Studio + views meta -->
		<div class="mt-2 flex items-center gap-3 text-xs text-white/60">
			{#if video?.channel.name}
				<span class="font-semibold text-white/80">{video.channel.name}</span>
				<span>&bull;</span>
			{/if}
			{#if video?.viewCount}
				<span>{formatViews(video.viewCount)} views</span>
			{/if}
		</div>

		<!-- CTA Buttons -->
		<div class="mt-5 flex flex-wrap items-center gap-3">
			{#if video}
				<button
					onclick={() => goto(`/watch/${video.id}`)}
					class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg transition-all hover:bg-white/90 active:scale-95"
				>
					<svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
					{video.isLive ? 'Watch Live' : 'Play Now'}
				</button>

				<button
					onclick={() => goto(`/watch/${video.id}`)}
					class="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					More Info
				</button>
			{/if}
		</div>

		<!-- ── Bottom Controls: Dots + Prev/Next ── -->
		<div class="mt-8 flex items-center justify-between">
			<!-- Slide dots with progress -->
			<div class="flex items-center gap-2">
				{#each videos as _video, i (i)}
					<button
						onclick={() => goTo(i)}
						aria-label="Go to slide {i + 1}"
						class="relative overflow-hidden rounded-full transition-all duration-300 {i === current
							? 'h-2 w-8 bg-white/30'
							: 'h-2 w-2 bg-white/30 hover:bg-white/50'}"
					>
						{#if i === current}
							<!-- Progress fill for active dot -->
							<div
								class="absolute top-0 left-0 h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
								style="width: {progress}%;"
							></div>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Prev / Next -->
			<div class="flex items-center gap-2">
				<button
					onclick={prev}
					aria-label="Previous"
					class="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					onclick={next}
					aria-label="Next"
					class="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
