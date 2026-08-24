<script lang="ts">
	import type { TwitterTweet, TwitterUser } from '$lib/server/twitter.js';
	import { goto } from '$app/navigation';

	let searchQuery = $state('');
	let results = $state<{ tweets: TwitterTweet[]; users: TwitterUser[]; pages?: number; currentPage?: number; totalCount?: number } | null>(null);
	let loading = $state(false);
	let error = $state('');
	let currentPage = $state(1);
	let pageSize = $state(10);

	// Top cosplayers list
	const topCosplayers = [
		{ username: 'BishoujoMom', name: 'Juliette Michele' },
		{ username: 'Ghouliette666', name: 'Ghouliette' },
		{ username: 'megturney', name: 'Meg Turney' },
		{ username: 'JessicaNigri', name: 'Jessica Nigri' },
		{ username: 'Amouranth', name: 'Amouranth' },
		{ username: 'bunnydelphine', name: 'Belle Delphine' },
		{ username: 'abecker_cos', name: 'Alina Becker' },
		{ username: 'n_mirikashi', name: 'Mirikashi' },
		{ username: 'Vinnegal', name: 'vinne🩸' },
		{ username: 'serinymph', name: 'Seri' },
		{ username: 'EnjiNight', name: 'Enji Night' },
		{ username: 'alexmucci_', name: 'Alexis Mucci' },
		{ username: 'biya1024', name: 'Biya' },
		{ username: 'iaintnguyen', name: 'Ain Nguyen' },
		{ username: 'DemonMiika', name: 'Demon Miika' },
		{ username: 'VexxViolette', name: 'Vexx' },
		{ username: 'hellyvalentine_', name: 'Helly Valentine' },
		{ username: 'unseelieallure', name: 'Kassandra Leigh' },
		{ username: 'natsume0v0', name: 'Natsume' },
		{ username: 'octokuro_model', name: 'Octokuro' },
		{ username: 'astasiadream', name: 'Astasia Dream' },
		{ username: 'seeu_cosplay', name: '小柔SeeU' },
		{ username: 'hattie_cos', name: 'Hattie' },
		{ username: 'SkyexSummers', name: 'SkyexSummers' },
		{ username: 'Yuumei_Daily', name: 'Yuumeilyn' },
		{ username: 'buttercupcos2', name: 'Buttercup' },
		{ username: 'sarameikasai', name: 'Sara Mei Kasai' },
		{ username: 'Bunnie_cosplay', name: 'Marie Bunny' },
		{ username: 'eurocatgirl', name: 'Amba Chan' },
		{ username: 'LiaMarieJohnson', name: 'Lia Marie Johnson' },
		{ username: 'shakeikurand', name: '鮭田いくら' },
		{ username: 'ikura_v508', name: 'いくら' },
		{ username: 'enjyu_ming9', name: 'Enjyu' },
		{ username: 'LiuliVT', name: 'Liuli' },
		{ username: 'enjyuandu', name: 'Enjyu (cosplay)' },
		{ username: 'HV_casual', name: 'Helly (casual)' }
	];

	async function handleSearch(e: Event) {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		// Check if it's a username search (starts with @)
		if (searchQuery.startsWith('@')) {
			const username = searchQuery.slice(1);
			goto(`/twitter/${username}`);
		} else {
			// Regular search
			loading = true;
			error = '';
			results = null;

			try {
				const response = await fetch('/api/twitter/search', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: searchQuery })
				});
				const data = await response.json();
				if (!response.ok) throw new Error(data.error || 'Search failed');
				results = data.results;
			} catch (e) {
				error = e instanceof Error ? e.message : 'Search failed';
			} finally {
				loading = false;
			}
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	function formatNumber(num: number) {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
		return num.toString();
	}

	function handleCosplayerClick(cosplayerUsername: string) {
		goto(`/twitter/${cosplayerUsername}`);
	}

	// Pagination
	const totalPages = $derived(results ? Math.ceil(results.tweets.length / pageSize) : 1);
	const paginatedTweets = $derived(results ? results.tweets.slice((currentPage - 1) * pageSize, currentPage * pageSize) : []);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function isVideo(url: string): boolean {
		return url.includes('video') || url.includes('mp4') || url.includes('mov');
	}
</script>

<svelte:head>
	<title>Twitter NSFW Browse &middot; Javster</title>
	<meta name="description" content="Browse NSFW content from Twitter" />
</svelte:head>

<div class="bg-background text-foreground mx-auto min-h-screen max-w-screen-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
	<!-- Search Section -->
	<div class="mb-8 space-y-4">
		<h1 class="text-foreground text-2xl font-extrabold sm:text-3xl">Twitter NSFW Browse</h1>
		<p class="text-muted-foreground">Search for NSFW content on Twitter</p>

		<form onsubmit={handleSearch} class="flex gap-2">
			<input
				bind:value={searchQuery}
				type="text"
				placeholder="Search for NSFW content, or @username for profile"
				class="border-border bg-card text-foreground flex-1 rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
			/>
			<button
				type="submit"
				disabled={loading}
				class="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-bold transition-colors hover:bg-primary/90 disabled:opacity-50"
			>
				{loading ? 'Searching...' : 'Search'}
			</button>
		</form>

		{#if error}
			<div class="border-destructive bg-destructive/10 text-destructive rounded-xl border p-4 text-sm">
				{error}
			</div>
		{/if}
	</div>

	<!-- Top Cosplayers Section -->
	<div class="mb-8">
		<h2 class="text-foreground mb-4 text-lg font-bold">Top Cosplayers</h2>
		<div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each topCosplayers as cosplayer (cosplayer.username)}
				<button
					onclick={() => handleCosplayerClick(cosplayer.username)}
					class="border-border bg-card hover:bg-primary/10 rounded-xl border p-4 text-left transition-colors"
				>
					<div class="text-foreground font-bold">{cosplayer.name}</div>
					<div class="text-muted-foreground text-sm">@{cosplayer.username}</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Results Section -->
	{#if results && results.tweets.length > 0}
		<div class="space-y-6">
			<div class="flex items-center justify-between">
				<h2 class="text-foreground text-lg font-bold">
					{results.tweets.length} results found
					{#if totalPages > 1}
						<span class="text-muted-foreground text-sm font-normal">
							(Page {currentPage} of {totalPages})
						</span>
					{/if}
				</h2>
				<span class="text-muted-foreground text-sm">
					{results.tweets.length} total results
				</span>
			</div>

			<div class="space-y-4">
				{#each paginatedTweets as tweet (tweet.id)}
					{@const user = results.users.find(u => u.id === tweet.authorId)}
					<div class="border-border bg-card hover:border-primary/30 rounded-xl border p-6 transition-all hover:shadow-lg">
						<!-- User Header -->
						{#if user}
							<div class="mb-4 flex items-center gap-3">
								<img
									src={user.profileImageUrl}
									alt={user.name}
									class="h-12 w-12 rounded-full"
								/>
								<div>
									<div class="flex items-center gap-2">
										<span class="text-foreground font-bold">{user.name}</span>
										{#if user.verified}
											<svg class="text-primary h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										{/if}
									</div>
									<span class="text-muted-foreground text-sm">@{user.username}</span>
								</div>
							</div>
						{/if}

						<!-- Tweet Content -->
						<p class="text-foreground mb-4 text-base leading-relaxed">{tweet.text}</p>

						<!-- Media -->
						{#if tweet.mediaUrls && tweet.mediaUrls.length > 0}
							<div class="mb-4 grid gap-3 {tweet.mediaUrls.length === 1 ? 'grid-cols-1' : tweet.mediaUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}">
								{#each tweet.mediaUrls as mediaUrl (mediaUrl)}
									{#if isVideo(mediaUrl)}
										<video
											src={mediaUrl}
											controls
											class="rounded-lg object-cover w-full"
											loading="lazy"
										/>
									{:else}
										<img
											src={mediaUrl}
											alt="Tweet media"
											class="rounded-lg object-cover w-full hover:opacity-90 transition-opacity cursor-pointer"
											loading="lazy"
										/>
									{/if}
								{/each}
							</div>
						{/if}

						<!-- NSFW Badge -->
						{#if tweet.isNsfw}
							<span class="border-destructive bg-destructive/10 text-destructive mb-3 inline-block rounded-lg border px-3 py-1 text-xs font-bold">
								NSFW
							</span>
						{/if}

						<!-- Tweet Stats -->
						<div class="border-border/50 flex flex-wrap items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
							<span class="flex items-center gap-1">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								{formatDate(tweet.createdAt)}
							</span>
							<span class="flex items-center gap-1">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
								{formatNumber(tweet.likeCount)}
							</span>
							<span class="flex items-center gap-1">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								{formatNumber(tweet.retweetCount)}
							</span>
							<span class="flex items-center gap-1">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								{formatNumber(tweet.viewCount)}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if totalPages > 1}
				<div class="flex items-center justify-center gap-2">
					<button
						onclick={prevPage}
						disabled={currentPage === 1}
						class="border-border bg-card hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border px-4 py-2 transition-colors"
					>
						Previous
					</button>
					
					{#each Array(totalPages) as _, i}
						<button
							onclick={() => goToPage(i + 1)}
							disabled={currentPage === i + 1}
							class="border-border bg-card hover:bg-primary/10 disabled:bg-primary disabled:text-primary-foreground disabled:cursor-not-allowed rounded-lg border px-4 py-2 transition-colors"
						>
							{i + 1}
						</button>
					{/each}
					
					<button
						onclick={nextPage}
						disabled={currentPage === totalPages}
						class="border-border bg-card hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border px-4 py-2 transition-colors"
					>
						Next
					</button>
				</div>
			{/if}
		</div>
	{:else if results && results.tweets.length === 0}
		<div class="border-border bg-card rounded-xl border p-8 text-center">
			<p class="text-muted-foreground">No results found for "{searchQuery}"</p>
		</div>
	{/if}
</div>
