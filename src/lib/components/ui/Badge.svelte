<script lang="ts">
	interface Props {
		variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'live' | 'success';
		class?: string;
		children: import('svelte').Snippet;
	}

	let { variant = 'default', class: className = '', children }: Props = $props();

	const base =
		'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors select-none';

	const variants = {
		default: 'bg-muted text-muted-foreground border border-border/80',
		primary: 'bg-primary/15 text-primary border border-primary/30',
		secondary: 'bg-secondary/15 text-secondary border border-secondary/30',
		outline: 'border border-border bg-card/60 text-muted-foreground',
		live: 'bg-destructive text-destructive-foreground font-bold animate-pulse shadow-sm shadow-destructive/40',
		success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
	};
</script>

<span class="{base} {variants[variant]} {className}">
	{#if variant === 'live'}
		<span class="h-1.5 w-1.5 rounded-full bg-current"></span>
	{/if}
	{@render children()}
</span>
