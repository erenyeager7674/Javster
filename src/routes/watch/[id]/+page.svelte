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

	function navigateToChannel(e: MouseEvent) {
		e.preventDefault();
		goto(`/channel/${video.channel.id}`);
	}
</script>

<svelte:head>
	<title>{video.title} &middot; Javster</title>
	<meta name="description" content={video.description} />
</svelte:head>

<div class="bg-background text-foreground mx-auto min-h-screen max-w-screen-2xl px-4 py-6 sm:px-8">
	<div class="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
		<!-- Left: Player + Info -->
		<div class="min-w-0 space-y-6">
			<!-- Player -->
			<VideoPlayer {video} />

			<!-- Title & Meta -->
			<div class="space-y-3">
				<div class="flex flex-wrap items-start gap-2">
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

				<h1 class="text-foreground text-xl leading-snug font-extrabold sm:text-2xl lg:text-3xl">
					{video.title}
				</h1>

				<!-- Stats + Actions -->
				<div class="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-4">
					<p class="text-muted-foreground text-xs">
						{formatViews(video.viewCount)} &bull; {relativeTime(video.publishedAt)}
					</p>

					<div class="flex items-center gap-2">
						<!-- Like / Dislike -->
						<button
							onclick={() => (liked = !liked)}
							class="flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors {liked
								? 'bg-primary/20 text-primary border-primary/40'
								: 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'}"
							aria-label={liked ? 'Unlike' : 'Like'}
							aria-pressed={liked}
						>
							<svg
								class="h-4 w-4"
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
							{(video.likeCount + (liked ? 1 : 0)).toLocaleString()}
						</button>

						{#if video.dislikeCount !== undefined}
							<span
								class="border-border bg-card text-muted-foreground flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold"
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
										d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
									/>
								</svg>
								{video.dislikeCount.toLocaleString()}
							</span>
						{/if}

						<Button variant="outline" size="sm">
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
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
							Share
						</Button>
					</div>
				</div>
			</div>

			<!-- Channel info + Subscribe -->
			<div
				class="border-border/80 bg-card flex items-start justify-between gap-4 rounded-2xl border p-4"
			>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<button
					onclick={navigateToChannel}
					class="group flex cursor-pointer items-center gap-3 border-0 bg-transparent text-left"
				>
					<Avatar src={video.channel.avatarUrl} alt={video.channel.name} size="lg" />
					<div>
						<div class="flex items-center gap-1">
							<span class="text-foreground group-hover:text-primary font-bold transition-colors">
								{video.channel.name}
							</span>
							{#if video.channel.verified}
								<svg
									class="text-primary h-4 w-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-label="Verified"
								>
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{/if}
						</div>
						<p class="text-muted-foreground text-xs">
							{formatSubscribers(video.channel.subscriberCount)}
						</p>
					</div>
				</button>

				<button
					onclick={() => (subscribed = !subscribed)}
					class="shrink-0 rounded-xl px-5 py-2 text-xs font-bold transition-colors {subscribed
						? 'border-border bg-muted text-muted-foreground border'
						: 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'}"
					aria-pressed={subscribed}
				>
					{subscribed ? 'Subscribed ✓' : 'Subscribe'}
				</button>
			</div>

			<!-- Description -->
			<div class="border-border/80 bg-card space-y-3 rounded-2xl border p-5">
				<div class="flex flex-wrap gap-2">
					{#if video.code}
						<span
							class="border-border bg-background text-primary rounded-lg border px-2.5 py-0.5 font-mono text-xs font-bold"
							>{video.code}</span
						>
					{/if}
					{#if video.year}
						<span
							class="border-border bg-background text-muted-foreground rounded-lg border px-2.5 py-0.5 text-xs"
							>{video.year}</span
						>
					{/if}
				</div>

				<div
					class="{descExpanded ? '' : 'line-clamp-3'} text-muted-foreground text-sm leading-relaxed"
				>
					{video.description}
				</div>

				<button
					onclick={() => (descExpanded = !descExpanded)}
					class="text-primary text-xs font-bold transition-colors hover:underline"
				>
					{descExpanded ? 'Show less' : 'Show more description'}
				</button>

				<!-- Tags -->
				{#if video.tags.length > 0}
					<div class="border-border/50 flex flex-wrap gap-1.5 border-t pt-2">
						{#each video.tags as tag (tag)}
							<a
								href="/search?q={encodeURIComponent(tag)}"
								class="border-border bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-primary rounded-lg border px-2.5 py-1 text-xs transition-colors"
							>
								#{tag}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Embed / Download Section -->
			{#if video.embedUrl || video.iframeHtml}
				<div class="border-border/80 bg-card space-y-3 rounded-2xl border p-5">
					<h2 class="text-foreground flex items-center gap-2 text-sm font-bold">
						<svg
							class="text-primary h-4 w-4"
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
							<p class="text-muted-foreground mb-1 text-xs">Direct Stream Embed</p>
							<div class="flex items-center gap-2">
								<code
									class="border-border bg-background text-foreground flex-1 truncate rounded-xl border px-3 py-2 font-mono text-xs"
									>{video.embedUrl}</code
								>
								<button
									onclick={() => navigator.clipboard.writeText(video.embedUrl ?? '')}
									class="border-border bg-muted text-foreground hover:border-primary shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors"
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
		<aside class="space-y-4">
			<h2 class="text-primary text-xs font-bold tracking-widest uppercase">Related Videos</h2>
			<div class="space-y-3">
				{#each related as vid (vid.id)}
					<VideoCard video={vid} layout="list" />
				{/each}
			</div>
		</aside>
	</div>
</div>
