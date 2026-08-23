<script lang="ts">
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import VideoRow from '$lib/components/video/VideoRow.svelte';
	import { formatSubscribers } from '$lib/types/index.js';

	let { data } = $props();
	const { channel, videos } = $derived(data);

	let subscribed = $state(false);
	let activeTab = $state<'videos' | 'about'>('videos');
</script>

<svelte:head>
	<title>{channel.name} &middot; Javster</title>
	<meta name="description" content={channel.description ?? `${channel.name} on Javster`} />
</svelte:head>

<div class="bg-background text-foreground min-h-screen">
	<!-- Channel banner -->
	<div class="bg-card border-border relative h-40 overflow-hidden border-b sm:h-56">
		{#if channel.bannerUrl}
			<img
				src={channel.bannerUrl}
				alt="{channel.name} banner"
				class="h-full w-full object-cover"
				loading="eager"
			/>
			<div class="to-background/80 absolute inset-0 bg-gradient-to-b from-transparent"></div>
		{:else}
			<div class="from-primary/20 via-card to-background h-full bg-gradient-to-br"></div>
		{/if}
	</div>

	<!-- Channel header -->
	<div class="mx-auto max-w-screen-xl px-4 sm:px-8">
		<div class="-mt-10 flex flex-col gap-6 pb-6 sm:-mt-12 sm:flex-row sm:items-end sm:gap-8">
			<!-- Avatar (overlaps banner) -->
			<div class="bg-background ring-primary/40 rounded-3xl p-1 shadow-xl ring-2">
				<Avatar
					src={channel.avatarUrl}
					alt={channel.name}
					size="xl"
					class="!h-20 !w-20 rounded-2xl sm:!h-24 sm:!w-24"
				/>
			</div>

			<div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<h1 class="text-foreground text-2xl font-extrabold sm:text-3xl">{channel.name}</h1>
						{#if channel.verified}
							<svg
								class="text-primary h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-label="Verified channel"
							>
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						{/if}
					</div>
					<p class="text-muted-foreground text-xs">
						{channel.handle} &bull; {formatSubscribers(channel.subscriberCount)}
						{#if channel.videoCount}
							&bull; {channel.videoCount} videos
						{/if}
					</p>
					{#if channel.description}
						<p class="text-muted-foreground/80 mt-1 line-clamp-1 max-w-xl text-xs">
							{channel.description}
						</p>
					{/if}
				</div>

				<button
					onclick={() => (subscribed = !subscribed)}
					class="self-start rounded-xl px-6 py-2.5 text-xs font-bold transition-all {subscribed
						? 'border-border bg-card text-muted-foreground border'
						: 'bg-primary text-primary-foreground shadow-primary/20 shadow-md hover:opacity-90'}"
					aria-pressed={subscribed}
				>
					{subscribed ? 'Subscribed ✓' : 'Subscribe'}
				</button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="border-border mb-8 flex gap-6 border-b">
			{#each [['videos', 'Videos'], ['about', 'About']] as [tab, label] (tab)}
				<button
					onclick={() => (activeTab = tab as 'videos' | 'about')}
					class="border-b-2 pb-3 text-xs font-bold transition-colors {activeTab === tab
						? 'border-primary text-primary'
						: 'text-muted-foreground hover:text-foreground border-transparent'}"
				>
					{label}
				</button>
			{/each}
		</div>

		<!-- Tab content -->
		{#if activeTab === 'videos'}
			<VideoRow title="All Videos" {videos} layout="grid" columns={4} showChannel={false} />
		{:else}
			<div class="max-w-2xl space-y-6">
				<div class="border-border/80 bg-card space-y-4 rounded-2xl border p-6">
					<h2 class="text-primary text-xs font-bold tracking-widest uppercase">About</h2>
					<p class="text-muted-foreground text-sm leading-relaxed">
						{channel.description ?? 'No description available.'}
					</p>
					<div class="border-border grid grid-cols-2 gap-4 border-t pt-4">
						<div>
							<p class="text-muted-foreground text-xs">Subscribers</p>
							<p class="text-foreground font-mono text-sm font-bold">
								{formatSubscribers(channel.subscriberCount)}
							</p>
						</div>
						{#if channel.videoCount}
							<div>
								<p class="text-muted-foreground text-xs">Videos</p>
								<p class="text-foreground font-mono text-sm font-bold">{channel.videoCount}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
