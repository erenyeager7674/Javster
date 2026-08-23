<script lang="ts">
	import VideoPlayer from '$lib/components/video/VideoPlayer.svelte';
	import VideoCard from '$lib/components/video/VideoCard.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatViews, formatSubscribers, relativeTime } from '$lib/types/index.js';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const { video, related } = $derived(data);

	let liked = $state(false);
	let subscribed = $state(false);
	let descExpanded = $state(false);
	let theaterMode = $state(false);

	function navigateToChannel(e: MouseEvent) {
		e.preventDefault();
		goto(`/channel/${video.channel.id}`);
	}
</script>

<svelte:head>
	<title>{video.title} &middot; Javster</title>
	<meta name="description" content={video.description} />
</svelte:head>

<!-- ─── Theater Mode overlay ─── -->
{#if theaterMode}
	<div
		class="fixed inset-0 z-[60] flex flex-col bg-black"
		role="dialog"
		aria-modal="true"
		aria-label="Theater mode"
	>
		<!-- Video fills all available space above the exit button -->
		<div class="flex flex-1 items-center justify-center overflow-hidden">
			<VideoPlayer {video} theaterMode={true} />
		</div>

		<!-- Centered exit button pinned to bottom -->
		<div class="flex shrink-0 items-center justify-center py-5">
			<button
				onclick={() => (theaterMode = false)}
				class="group flex items-center gap-2.5 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
				style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18);"
				onmouseenter={(e) => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.18)'}
				onmouseleave={(e) => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.1)'}
				aria-label="Exit theater mode"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
				</svg>
				Exit Theater
			</button>
		</div>
	</div>
{/if}

<!-- ─── Normal page layout ─── -->
<div class="mx-auto min-h-screen max-w-screen-2xl px-2 py-2 sm:px-4 sm:py-4 lg:px-8 lg:py-8" style="background:#0e0e10;">
	<div class="grid grid-cols-1 gap-4 lg:gap-8 xl:grid-cols-[1fr_380px]">
		<!-- Left: Player + Info -->
		<div class="min-w-0 space-y-3 sm:space-y-6">

			<!-- Player + theater toggle -->
			<div class="relative">
				<VideoPlayer {video} theaterMode={false} />

				<!-- Theater mode button — sits bottom-right of player, always visible on non-mobile -->
				<button
					onclick={() => (theaterMode = true)}
					class="absolute right-3 bottom-14 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all duration-150"
					style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.15);"
					onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(109,40,217,0.85)'; el.style.borderColor='rgba(167,139,250,0.4)'; }}
					onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(0,0,0,0.6)'; el.style.borderColor='rgba(255,255,255,0.15)'; }}
					aria-label="Enter theater mode"
				>
					<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
					</svg>
					Theater
				</button>
			</div>

			<!-- Title & Meta -->
			<div class="space-y-1.5 sm:space-y-3">
				<div class="flex flex-wrap items-start gap-1 sm:gap-2">
					{#if video.isLive}
						<Badge variant="live">LIVE NOW</Badge>
					{/if}
					<Badge variant="primary">{video.category}</Badge>
					{#if video.rating}
						<Badge variant="outline">{video.rating}</Badge>
					{/if}
					{#if video.isHd}
						<Badge variant="secondary">HD 1080P</Badge>
					{/if}
				</div>

				<h1 class="text-foreground text-base leading-snug font-extrabold sm:text-lg lg:text-xl xl:text-2xl">
					{video.title}
				</h1>

				<!-- Stats + Actions -->
				<div class="border-border flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-4">
					<p class="text-muted-foreground text-[10px] sm:text-xs">
						{formatViews(video.viewCount)} &bull; {relativeTime(video.publishedAt)}
					</p>

					<div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
						<!-- Like / Dislike -->
						<button
							onclick={() => (liked = !liked)}
							class="flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-colors sm:px-3 sm:py-1.5 sm:text-xs sm:rounded-xl {liked
								? 'bg-primary/20 text-primary border-primary/40'
								: 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'}"
							aria-label={liked ? 'Unlike' : 'Like'}
							aria-pressed={liked}
						>
							<svg
								class="h-3 w-3 sm:h-4 sm:w-4"
								fill={liked ? 'currentColor' : 'none'}
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
								/>
							</svg>
							<span class="hidden sm:inline">{(video.likeCount + (liked ? 1 : 0)).toLocaleString()}</span>
						</button>

						{#if video.dislikeCount !== undefined}
							<span
								class="border-border bg-card text-muted-foreground flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold sm:px-2.5 sm:py-1.5 sm:text-xs sm:rounded-xl"
							>
								<svg
									class="h-3 w-3 sm:h-4 sm:w-4"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
									/>
								</svg>
								<span class="hidden sm:inline">{video.dislikeCount.toLocaleString()}</span>
							</span>
						{/if}

						<Button variant="outline" size="sm" class="text-[10px] sm:text-xs">
							<svg
								class="h-3 w-3 sm:h-4 sm:w-4"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
							<span class="hidden sm:inline">Share</span>
						</Button>
					</div>
				</div>
			</div>

			<!-- Channel info + Subscribe -->
			<div
				class="border-border/80 bg-card flex items-start justify-between gap-2 rounded-xl border p-2 sm:gap-4 sm:rounded-2xl sm:p-4"
			>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<button
					onclick={navigateToChannel}
					class="group flex cursor-pointer items-center gap-2 border-0 bg-transparent text-left sm:gap-3"
				>
					<Avatar src={video.channel.avatarUrl} alt={video.channel.name} size="sm" class="sm:h-12 sm:w-12 sm:text-base" />
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-1">
							<span class="text-foreground group-hover:text-primary truncate font-bold transition-colors text-xs sm:text-sm sm:text-base">
								{video.channel.name}
							</span>
							{#if video.channel.verified}
								<svg
									class="text-primary h-3 w-3 shrink-0 sm:h-4 sm:w-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-label="Verified"
								>
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{/if}
						</div>
						<p class="text-muted-foreground text-[10px] sm:text-xs">
							{formatSubscribers(video.channel.subscriberCount)}
						</p>
					</div>
				</button>

				<button
					onclick={() => (subscribed = !subscribed)}
					class="shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs {subscribed
						? 'border-border bg-muted text-muted-foreground border'
						: 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'}"
					aria-pressed={subscribed}
				>
					{subscribed ? '✓' : 'Subscribe'}
				</button>
			</div>

			<!-- Description -->
			<div class="border-border/80 bg-card space-y-2 rounded-xl border p-2 sm:space-y-3 sm:rounded-2xl sm:p-5">
				<div class="flex flex-wrap gap-1.5 sm:gap-2">
					{#if video.code}
						<span
							class="border-border bg-background text-primary rounded-lg border px-1.5 py-0.5 font-mono text-[10px] font-bold sm:px-2.5 sm:text-xs"
							>{video.code}</span
						>
					{/if}
					{#if video.year}
						<span
							class="border-border bg-background text-muted-foreground rounded-lg border px-1.5 py-0.5 text-[10px] sm:px-2.5 sm:text-xs"
							>{video.year}</span
						>
					{/if}
				</div>

				<div
					class="{descExpanded ? '' : 'line-clamp-3'} text-muted-foreground text-xs leading-relaxed sm:text-sm"
				>
					{video.description}
				</div>

				<button
					onclick={() => (descExpanded = !descExpanded)}
					class="text-primary text-[10px] font-bold transition-colors hover:underline sm:text-xs"
				>
					{descExpanded ? 'Show less' : 'Show more description'}
				</button>

				<!-- Tags -->
				{#if video.tags.length > 0}
					<div class="border-border/50 flex flex-wrap gap-1 border-t pt-1.5 sm:gap-1.5 sm:pt-2">
						{#each video.tags as tag (tag)}
							<a
								href="/search?q={encodeURIComponent(tag)}"
								class="border-border bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-primary rounded-lg border px-1.5 py-0.5 text-[10px] transition-colors sm:px-2.5 sm:py-1 sm:text-xs"
							>
								#{tag}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Embed / Download Section -->
			{#if video.embedUrl || video.iframeHtml}
				<div class="border-border/80 bg-card space-y-2 rounded-xl border p-2 sm:space-y-3 sm:rounded-2xl sm:p-5">
					<h2 class="text-foreground flex items-center gap-2 text-xs font-bold sm:text-sm">
						<svg
							class="text-primary h-3 w-3 sm:h-4 sm:w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/></svg
						>
						Embed Stream
					</h2>

					{#if video.embedUrl}
						<div>
							<p class="text-muted-foreground mb-1 text-[10px] sm:text-xs">Direct Stream Embed</p>
							<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
								<code
									class="border-border bg-background text-foreground flex-1 truncate rounded-lg border px-2 py-1.5 font-mono text-[10px] break-all sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs"
									>{video.embedUrl}</code
								>
								<button
									onclick={() => navigator.clipboard.writeText(video.embedUrl ?? '')}
									class="border-border bg-muted text-foreground hover:border-primary shrink-0 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-colors w-full sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-xs sm:w-auto"
								>
									Copy
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right: Related Videos -->
		<aside class="space-y-2 sm:space-y-4">
			<h2 class="text-primary text-[10px] font-bold tracking-widest uppercase sm:text-xs">Related Videos</h2>
			<div class="space-y-1.5 sm:space-y-3">
				{#each related as vid (vid.id)}
					<VideoCard video={vid} layout="list" />
				{/each}
			</div>
		</aside>
	</div>
</div>