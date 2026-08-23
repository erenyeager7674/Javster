<script lang="ts">
	import type { Actress } from '$lib/types/index.js';

	interface Props {
		actress: Actress;
		class?: string;
	}

	let { actress, class: className = '' }: Props = $props();

	let imageError = $state(false);

	const initial = $derived(actress.name ? actress.name.charAt(0).toUpperCase() : '?');
	const thumbUrl = $derived(actress.previewThumbs?.[0] ?? actress.avatarUrl ?? '');
</script>

<a
	href="/actress/{actress.slug}"
	class="group bg-card border-border/70 hover:border-primary/40 relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg {className}"
>
	<!-- ── Portrait Poster Frame ── -->
	<div class="bg-muted relative aspect-[3/4] w-full overflow-hidden">
		{#if thumbUrl && !imageError}
			<img
				src={thumbUrl}
				alt={actress.name}
				loading="lazy"
				onerror={() => (imageError = true)}
				class="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
			/>
		{:else}
			<div class="bg-muted/80 flex h-full w-full items-center justify-center">
				<span
					class="text-muted-foreground/40 group-hover:text-primary font-mono text-4xl font-extrabold transition-colors"
				>
					{initial}
				</span>
			</div>
		{/if}

		<!-- Natural dark bottom scrim gradient for maximum text contrast -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

		<!-- Subtle Video Count Badge (top-right) -->
		<div class="absolute top-2.5 right-2.5">
			<span
				class="rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold text-white/90 backdrop-blur-xs"
			>
				{actress.videoCount}
			</span>
		</div>

		<!-- Name & Meta (Anchored in bottom scrim) -->
		<div class="absolute right-0 bottom-0 left-0 space-y-0.5 p-3.5">
			<h3
				class="group-hover:text-primary line-clamp-1 text-sm font-bold tracking-tight text-white transition-colors duration-150"
			>
				{actress.name}
			</h3>
			<p class="text-[11px] font-medium text-white/70">
				{actress.videoCount.toLocaleString()}
				{actress.videoCount === 1 ? 'video' : 'videos'}
			</p>
		</div>
	</div>
</a>
