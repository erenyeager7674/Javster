<script lang="ts">
	import type { Video } from '$lib/types/index.js';

	interface Props {
		video: Video;
		autoplay?: boolean;
		theaterMode?: boolean;
		onTheaterToggle?: () => void;
	}

	let { video, autoplay = false, theaterMode = false, onTheaterToggle }: Props = $props();

	let videoEl = $state<HTMLVideoElement>();
	let playing = $state(false);
	let muted = $state(true);
	let fullscreen = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let showControls = $state(true);
	let controlsTimer: ReturnType<typeof setTimeout>;

	function togglePlay() {
		if (!videoEl) return;
		if (videoEl.paused) {
			videoEl.play();
			playing = true;
		} else {
			videoEl.pause();
			playing = false;
		}
	}

	function toggleMute() {
		if (!videoEl) return;
		videoEl.muted = !videoEl.muted;
		muted = videoEl.muted;
	}

	function handleTimeUpdate() {
		if (!videoEl) return;
		currentTime = videoEl.currentTime;
		duration = videoEl.duration || 0;
	}

	function seek(e: MouseEvent) {
		if (!videoEl) return;
		const bar = e.currentTarget as HTMLElement;
		const rect = bar.getBoundingClientRect();
		const pct = (e.clientX - rect.left) / rect.width;
		videoEl.currentTime = pct * duration;
	}

	function toggleFullscreen() {
		if (!videoEl) return;
		if (!document.fullscreenElement) {
			videoEl.parentElement?.requestFullscreen();
			fullscreen = true;
		} else {
			document.exitFullscreen();
			fullscreen = false;
		}
	}

	function formatTime(s: number) {
		if (!isFinite(s)) return '0:00';
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60);
		return `${m}:${String(sec).padStart(2, '0')}`;
	}

	function resetControlsTimer() {
		showControls = true;
		clearTimeout(controlsTimer);
		controlsTimer = setTimeout(() => {
			if (playing) showControls = false;
		}, 3000);
	}

	const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="group relative w-full overflow-hidden bg-black {theaterMode ? 'aspect-video' : 'aspect-video rounded-xl max-w-5xl mx-auto'}"
	onmousemove={resetControlsTimer}
	onmouseleave={() => {
		if (playing) showControls = false;
	}}
>
	<!-- Video element -->
	{#if video.videoUrl}
		<!-- eslint-disable-next-line svelte-a11y-media-has-caption -->
		<video
			bind:this={videoEl}
			src={video.videoUrl}
			poster={video.thumbnailUrl}
			{autoplay}
			{muted}
			preload="metadata"
			class="h-full w-full object-contain"
			ontimeupdate={handleTimeUpdate}
			onplay={() => (playing = true)}
			onpause={() => (playing = false)}
			onclick={togglePlay}
		></video>
	{:else if video.iframeHtml}
		<!-- apiJAV permanent embed iframe -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="h-full w-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0">
			{@html video.iframeHtml}
		</div>
	{:else if video.embedUrl}
		<iframe
			src={video.embedUrl}
			title={video.title}
			class="h-full w-full border-0"
			allowfullscreen
			allow="autoplay; fullscreen; encrypted-media"
			scrolling="no"
		></iframe>
	{:else}
		<!-- Poster fallback -->
		<img src={video.thumbnailUrl} alt={video.title} class="h-full w-full object-cover" />
	{/if}

	<!-- Controls overlay — only shown for native <video> playback -->
	{#if video.videoUrl}
		<div
			class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 {showControls ||
			!playing
				? 'opacity-100'
				: 'opacity-0'}"
		>
			<!-- Center play button (only when paused) -->
			{#if !playing}
				<button
					onclick={togglePlay}
					class="absolute inset-0 flex items-center justify-center"
					aria-label="Play"
				>
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
					>
						<svg class="h-7 w-7 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				</button>
			{/if}

			<!-- Bottom controls bar -->
			<div class="space-y-2 p-2 sm:p-3 lg:p-4">
				<!-- Progress bar -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="group/bar relative h-1 cursor-pointer rounded-full bg-white/20 transition-all duration-150 hover:h-1.5"
					onclick={seek}
					role="slider"
					aria-label="Video progress"
					aria-valuenow={progressPct}
					aria-valuemin={0}
					aria-valuemax={100}
					tabindex="0"
				>
					<div class="bg-accent-500 relative h-full rounded-full" style="width: {progressPct}%">
						<div
							class="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover/bar:opacity-100"
						></div>
					</div>
				</div>

				<!-- Control buttons -->
				<div class="flex items-center gap-1.5 sm:gap-2">
					<!-- Play/Pause -->
					<button
						onclick={togglePlay}
						class="hover:text-accent-300 flex h-7 w-7 items-center justify-center text-white transition-colors sm:h-8 sm:w-8"
						aria-label={playing ? 'Pause' : 'Play'}
					>
						{#if playing}
							<svg class="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
							</svg>
						{:else}
							<svg class="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						{/if}
					</button>

					<!-- Mute -->
					<button
						onclick={toggleMute}
						class="hover:text-accent-300 flex h-7 w-7 items-center justify-center text-white transition-colors sm:h-8 sm:w-8"
						aria-label={muted ? 'Unmute' : 'Mute'}
					>
						{#if muted}
							<svg
								class="h-4 w-4 sm:h-5 sm:w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
								/>
							</svg>
						{:else}
							<svg
								class="h-4 w-4 sm:h-5 sm:w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
								/>
							</svg>
						{/if}
					</button>

					<!-- Time display -->
					<span class="ml-1 font-mono text-[10px] text-zinc-300 sm:text-xs">
						{formatTime(currentTime)} / {formatTime(duration)}
					</span>

					<!-- Spacer -->
					<div class="flex-1"></div>

					<!-- Fullscreen -->
					<button
						onclick={toggleFullscreen}
						class="hover:text-accent-300 flex h-7 w-7 items-center justify-center text-white transition-colors sm:h-8 sm:w-8"
						aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
					>
						{#if fullscreen}
							<svg
								class="h-4 w-4 sm:h-5 sm:w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
								/>
							</svg>
						{:else}
							<svg
								class="h-4 w-4 sm:h-5 sm:w-5"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
								/>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
