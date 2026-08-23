<script lang="ts">
	interface Props {
		variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'accent';
		size?: 'sm' | 'md' | 'lg' | 'icon';
		href?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: import('svelte').Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		href,
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer select-none active:scale-[0.98]';

	const variants = {
		default: 'bg-muted text-foreground hover:bg-muted/80 border border-border/80 shadow-xs',
		primary: 'bg-primary text-primary-foreground hover:opacity-95 shadow-md shadow-primary/20',
		secondary:
			'bg-secondary text-secondary-foreground hover:opacity-95 shadow-md shadow-secondary/20',
		accent: 'bg-primary text-primary-foreground hover:opacity-95 shadow-md shadow-primary/25',
		ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
		outline: 'border border-border bg-card text-foreground hover:bg-muted hover:border-primary/40',
		destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm'
	};

	const sizes = {
		sm: 'h-8 px-3 text-xs',
		md: 'h-9.5 px-4 text-sm',
		lg: 'h-11 px-6 text-sm sm:text-base font-bold',
		icon: 'h-9.5 w-9.5 p-0'
	};

	const cls = $derived([base, variants[variant], sizes[size], className].join(' '));
</script>

{#if href}
	<!-- eslint-disable-next-line sveltejs-valid-derive-classes -->
	<a {href} class={cls} aria-disabled={disabled}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={cls} {onclick}>
		{@render children()}
	</button>
{/if}
