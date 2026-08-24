<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types.js';
	import type { TwitterUser } from '$lib/server/twitter.js';

	let { data } = $props<{ data: PageData }>();

	let loading = $state(false);
	let error = $state('');
	let countdown = $state(0);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;
	let user = $state<TwitterUser | null>(null);

	// Sync server data into reactive state on every navigation
	$effect(() => {
		error = data.error || '';
		user = data.user ? { ...data.user } : null;
	});

	function startCountdown() {
		countdown = 5;
		if (countdownInterval) clearInterval(countdownInterval);
		countdownInterval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(countdownInterval!);
				countdownInterval = null;
			}
		}, 1000);
	}

	async function refreshData() {
		if (countdown > 0 || !user) return;
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/twitter/user', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: user.username })
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || 'Failed to refresh data');
			// Navigate back to page 1 (no cursor) to show fresh results
			const u = new URL($page.url);
			u.searchParams.delete('cursor');
			await goto(u.toString(), { invalidateAll: true });
			startCountdown();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to refresh data';
		} finally {
			loading = false;
		}
	}

	function navigateCursor(cursor: string | null) {
		const u = new URL($page.url);
		if (cursor) {
			u.searchParams.set('cursor', cursor);
		} else {
			u.searchParams.delete('cursor');
		}
		goto(u.toString());
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatNumber(num: number) {
		if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
		if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
		return num.toString();
	}

	function isVideo(url: string): boolean {
		return url.includes('video') || url.includes('mp4') || url.includes('mov');
	}

	const isFirstPage = $derived(!data.currentCursor);
</script>

<svelte:head>
	<title>@{user?.username || 'Cosplayer'} - Twitter NSFW &middot; Javster</title>
	<meta name="description" content="View posts and content from @{user?.username}" />
</svelte:head>

<div class="bg-background text-foreground mx-auto min-h-screen max-w-4xl px-3 py-4 sm:px-6 sm:py-6">
	{#if user}
		<!-- Back Button -->
		<div class="mb-4">
			<a
				href="/twitter"
				class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Cosplayers
			</a>
		</div>

		<!-- Profile Header -->
		<div class="border-border bg-card mb-5 rounded-xl border p-4 sm:p-5">
			<div class="flex gap-4">
				<img
					src={user.profileImageUrl}
					alt={user.name}
					class="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
				/>
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<h1 class="text-foreground truncate text-lg font-bold sm:text-xl">{user.name}</h1>
						{#if user.verified}
							<svg class="text-primary h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						{/if}
					</div>
					<p class="text-muted-foreground text-sm">@{user.username}</p>
					{#if user.description}
						<p class="text-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed">{user.description}</p>
					{/if}
					<!-- Stats -->
					<div class="mt-2 flex flex-wrap gap-4 text-xs">
						<span>
							<span class="text-foreground font-semibold">{formatNumber(user.followersCount)}</span>
							<span class="text-muted-foreground"> followers</span>
						</span>
						<span>
							<span class="text-foreground font-semibold">{formatNumber(user.followingCount)}</span>
							<span class="text-muted-foreground"> following</span>
						</span>
						<span>
							<span class="text-foreground font-semibold">{formatNumber(user.tweetsCount)}</span>
							<span class="text-muted-foreground"> tweets</span>
						</span>
					</div>
				</div>
				<!-- Refresh Button -->
				<div class="shrink-0 self-start">
					<button
						onclick={refreshData}
						disabled={loading || countdown > 0}
						class="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						{loading ? '...' : countdown > 0 ? `${countdown}s` : 'Refresh'}
					</button>
				</div>
			</div>
		</div>

		{#if error}
			<div class="border-destructive bg-destructive/10 text-destructive mb-4 rounded-lg border p-3 text-xs">
				{error}
			</div>
		{/if}

		<!-- Posts Section -->
		<div class="space-y-3">
			<!-- Section Header -->
			<div class="flex items-center justify-between">
				<h2 class="text-foreground text-sm font-semibold">
					Posts
					{#if !isFirstPage}
						<span class="text-muted-foreground font-normal"> &mdash; continued</span>
					{/if}
				</h2>
				<span class="text-muted-foreground text-xs">{data.tweets?.length ?? 0} posts this page</span>
			</div>

			{#if data.tweets && data.tweets.length > 0}
				<!-- Tweet Cards -->
				{#each data.tweets as tweet (tweet.id)}
					<div class="border-border bg-card hover:border-primary/30 rounded-lg border p-3 transition-all hover:shadow-md sm:p-4">
						<!-- Tweet Text -->
						<p class="text-foreground mb-3 text-sm leading-relaxed">{tweet.text}</p>

						<!-- Media -->
						{#if tweet.mediaUrls && tweet.mediaUrls.length > 0}
							<div
								class="mb-3 grid gap-1.5 {tweet.mediaUrls.length === 1
									? 'grid-cols-1'
									: tweet.mediaUrls.length === 2
										? 'grid-cols-2'
										: 'grid-cols-3'}"
							>
								{#each tweet.mediaUrls as mediaUrl (mediaUrl)}
									{#if isVideo(mediaUrl)}
										<video
											src={mediaUrl}
											controls
											class="max-h-72 w-full rounded-md object-cover"
										></video>
									{:else}
										<img
											src={mediaUrl}
											alt="Tweet media"
											class="max-h-72 w-full cursor-pointer rounded-md object-cover transition-opacity hover:opacity-90"
											loading="lazy"
										/>
									{/if}
								{/each}
							</div>
						{/if}

						<!-- NSFW Badge -->
						{#if tweet.isNsfw}
							<span class="border-destructive bg-destructive/10 text-destructive mb-2 inline-block rounded px-2 py-0.5 text-xs font-semibold">
								NSFW
							</span>
						{/if}

						<!-- Stats -->
						<div class="border-border/40 flex flex-wrap items-center gap-3 border-t pt-2 text-xs text-muted-foreground">
							<span>{formatDate(tweet.createdAt)}</span>
							<span class="flex items-center gap-1">
								<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
								{formatNumber(tweet.likeCount)}
							</span>
							<span class="flex items-center gap-1">
								<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								{formatNumber(tweet.retweetCount)}
							</span>
							<span class="flex items-center gap-1">
								<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								{formatNumber(tweet.viewCount)}
							</span>
						</div>
					</div>
				{/each}

				<!-- Cursor Pagination Controls -->
				<div class="flex items-center justify-between pt-2">
					<button
						onclick={() => navigateCursor(null)}
						disabled={isFirstPage}
						class="border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
					>
						← First page
					</button>

					{#if data.hasNextPage && data.nextCursor}
						<button
							onclick={() => navigateCursor(data.nextCursor)}
							class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
						>
							Next page →
						</button>
					{:else}
						<span class="text-muted-foreground text-xs">No more posts</span>
					{/if}
				</div>
			{:else}
				<div class="border-border bg-card rounded-lg border p-6 text-center">
					<p class="text-muted-foreground text-sm">No posts found for @{user.username}</p>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Error State -->
		<div class="mb-4">
			<a
				href="/twitter"
				class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Cosplayers
			</a>
		</div>

		<div class="border-destructive bg-destructive/10 text-destructive rounded-xl border p-6 text-center">
			<p class="mb-2 font-bold">Error loading cosplayer data</p>
			<p class="text-sm">{error}</p>
		</div>
	{/if}
</div>
