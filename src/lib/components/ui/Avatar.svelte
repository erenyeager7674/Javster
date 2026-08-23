<script lang="ts">
	interface Props {
		src?: string;
		alt?: string;
		fallback?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
	}

	let { src, alt = '', fallback, size = 'md', class: className = '' }: Props = $props();

	let imgError = $state(false);

	const initials = $derived(
		fallback ??
			alt
				.split(' ')
				.slice(0, 2)
				.map((w) => w[0] ?? '')
				.join('')
				.toUpperCase()
	);

	const sizes = {
		xs: 'h-6 w-6 text-[10px]',
		sm: 'h-8 w-8 text-xs',
		md: 'h-10 w-10 text-sm',
		lg: 'h-12 w-12 text-base',
		xl: 'h-16 w-16 text-xl'
	};
</script>

<span
	class="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 font-semibold text-zinc-400 ring-1 ring-zinc-700/60 {sizes[size]} {className}"
	title={alt}
>
	{#if src && !imgError}
		<img
			{src}
			{alt}
			class="h-full w-full object-cover"
			onerror={() => (imgError = true)}
			loading="lazy"
		/>
	{:else}
		<span aria-hidden="true">{initials}</span>
	{/if}
</span>
