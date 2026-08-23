<script lang="ts">
	import type { Video } from '$lib/types/index.js';
	import { formatDuration, formatViews, relativeTime } from '$lib/types/index.js';
	import { goto } from '$app/navigation';

	interface Props {
		video: Video;
		layout?: 'grid' | 'list';
		showChannel?: boolean;
		class?: string;
	}

	let { video, layout = 'grid', showChannel = true, class: className = '' }: Props = $props();

	function navigateToVideo(e: MouseEvent) {
		e.preventDefault();
		goto(`/watch/${video.id}`);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			goto(`/watch/${video.id}`);
		}
	}
</script>

<div
	class="group block cursor-pointer outline-none {className}"
	role="button"
	tabindex="0"
	onclick={navigateToVideo}
	onkeydown={handleKeyDown}
>
	{#if layout === 'grid'}
		<!-- Grid Layout -->
		<div class="flex flex-col space-y-2.5">
			<!-- Thumbnail Container -->
			<div class="bg-muted/80 relative aspect-video w-full overflow-hidden rounded-xl">
				<img
					src={video.thumbnailUrl}
					alt={video.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
					width="640"
					height="360"
				/>

				<!-- Subtle dark gradient on hover -->
				<div
					class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				></div>

				<!-- Live / Quality badge top-left -->
				<div class="pointer-events-none absolute top-2 left-2 flex items-center gap-1.5">
					{#if video.isLive}
						<span
							class="inline-flex animate-pulse items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-white"></span>
							LIVE
						</span>
					{:else if video.isHd}
						<span
							class="rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/90 backdrop-blur-xs"
						>
							HD
						</span>
					{/if}
				</div>

				<!-- Duration badge bottom-right -->
				{#if !video.isLive && video.duration}
					<div class="pointer-events-none absolute right-2 bottom-2">
						<span
							class="rounded bg-black/85 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white/95 backdrop-blur-xs"
						>
							{formatDuration(video.duration)}
						</span>
					</div>
				{/if}

				<!-- Watched progress indicator (if present) -->
				{#if video.progress && video.progress > 0}
					<div class="absolute right-0 bottom-0 left-0 h-1 bg-black/40">
						<div class="bg-primary h-full" style="width:{video.progress * 100}%;"></div>
					</div>
				{/if}
			</div>

			<!-- Meta Details -->
			<div class="space-y-1">
				<!-- Code & Category tag -->
				{#if video.code || video.category}
					<div class="flex items-center gap-2 text-[11px]">
						{#if video.code}
							<span class="text-primary font-mono font-bold tracking-wide">{video.code}</span>
						{/if}
						{#if video.category && video.category !== 'Uncategorized'}
							<span class="text-muted-foreground/75 truncate font-medium">{video.category}</span>
						{/if}
					</div>
				{/if}

				<!-- Video Title -->
				<h3
					class="text-foreground group-hover:text-primary line-clamp-2 text-xs leading-snug font-semibold transition-colors duration-150 sm:text-[13px]"
				>
					{video.title}
				</h3>

				<!-- Channel & Stats line -->
				<div class="text-muted-foreground flex items-center gap-1.5 truncate text-[11px]">
					{#if showChannel && video.channel.name}
						<span class="hover:text-foreground truncate font-medium">{video.channel.name}</span>
						<span>&bull;</span>
					{/if}
					<span class="font-mono tabular-nums">{formatViews(video.viewCount)}</span>
					<span>&bull;</span>
					<span class="whitespace-nowrap">{relativeTime(video.publishedAt)}</span>
				</div>
			</div>
		</div>
	{:else}
		<!-- List Layout (Horizontal) -->
		<div
			class="group-hover:bg-muted/40 flex gap-2.5 rounded-xl p-1.5 transition-colors duration-150 sm:gap-3.5"
		>
			<div
				class="bg-muted/80 relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl sm:w-36 lg:w-44"
			>
				<img
					src={video.thumbnailUrl}
					alt={video.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					width="176"
					height="99"
				/>
				{#if video.isLive}
					<div class="absolute bottom-1.5 left-1.5">
						<span class="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase"
							>LIVE</span
						>
					</div>
				{:else if video.duration}
					<span
						class="absolute right-1.5 bottom-1.5 rounded bg-black/85 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white"
					>
						{formatDuration(video.duration)}
					</span>
				{/if}
			</div>

			<div class="min-w-0 flex-1 space-y-1 py-0.5">
				{#if video.code}
					<span class="text-primary font-mono text-[10px] font-bold tracking-wide"
						>{video.code}</span
					>
				{/if}
				<h3
					class="text-foreground group-hover:text-primary line-clamp-2 text-xs leading-snug font-semibold transition-colors sm:text-sm"
				>
					{video.title}
				</h3>
				<p class="text-muted-foreground text-xs">{video.channel.name}</p>
				<p class="text-muted-foreground/75 font-mono text-[11px]">
					{formatViews(video.viewCount)} &bull; {relativeTime(video.publishedAt)}
				</p>
			</div>
		</div>
	{/if}
</div>
