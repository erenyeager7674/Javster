<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		onNavigate: (page: number) => void;
	}

	let { currentPage, totalPages, onNavigate }: Props = $props();

	function buildPages(cur: number, total: number): (number | '...')[] {
		if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
		const items: (number | '...')[] = [1];
		if (cur > 3) items.push('...');
		for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) items.push(i);
		if (cur < total - 2) items.push('...');
		items.push(total);
		return items;
	}

	const pageItems = $derived(buildPages(currentPage, totalPages));
</script>

{#if totalPages > 1}
	<nav
		class="mt-12 flex flex-wrap items-center justify-center gap-1.5"
		aria-label="Pagination Navigation"
	>
		<!-- Previous button -->
		<button
			onclick={() => onNavigate(currentPage - 1)}
			disabled={currentPage <= 1}
			class="border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/80 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
			aria-label="Previous page"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Page Numbers -->
		{#each pageItems as p, idx (idx)}
			{#if p === '...'}
				<span
					class="text-muted-foreground flex h-10 w-8 items-center justify-center text-xs font-semibold select-none"
				>
					...
				</span>
			{:else}
				<button
					onclick={() => onNavigate(p as number)}
					class="flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-xs font-semibold transition-all duration-150 active:scale-95 {p ===
					currentPage
						? 'border-primary bg-primary text-primary-foreground shadow-primary/25 border font-bold shadow-md'
						: 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/80 hover:text-foreground border'}"
					aria-current={p === currentPage ? 'page' : undefined}
					aria-label="Page {p}"
				>
					{p}
				</button>
			{/if}
		{/each}

		<!-- Next button -->
		<button
			onclick={() => onNavigate(currentPage + 1)}
			disabled={currentPage >= totalPages}
			class="border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/80 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
			aria-label="Next page"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		{#if totalPages > 7}
			<div
				class="border-border bg-card/80 text-muted-foreground ml-2 hidden items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs sm:flex"
			>
				<span>Go to</span>
				<input
					type="number"
					min="1"
					max={totalPages}
					value={currentPage}
					onchange={(e) => {
						const v = parseInt((e.currentTarget as HTMLInputElement).value, 10);
						if (v >= 1 && v <= totalPages) onNavigate(v);
					}}
					class="border-border bg-background text-foreground focus:border-primary focus:ring-primary h-7 w-12 rounded-lg border px-1 text-center font-mono text-xs transition-colors outline-none focus:ring-1"
					aria-label="Go to page number"
				/>
				<span>/ {totalPages}</span>
			</div>
		{/if}
	</nav>
{/if}
