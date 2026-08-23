<script lang="ts">
	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		class?: string;
		children: import('svelte').Snippet;
	}

	let { content, position = 'top', class: className = '', children }: Props = $props();

	let show = $state(false);
	let tooltipRef = $state<HTMLElement>();

	const positions = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrows = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-zinc-700 border-b-transparent border-l-transparent border-r-transparent',
		bottom:
			'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-700 border-t-transparent border-l-transparent border-r-transparent',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-700 border-r-transparent border-t-transparent border-b-transparent',
		right:
			'right-full top-1/2 -translate-y-1/2 border-r-zinc-700 border-l-transparent border-t-transparent border-b-transparent'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative inline-flex"
	onmouseenter={() => (show = true)}
	onmouseleave={() => (show = false)}
>
	{@render children()}

	{#if show}
		<div
			bind:this={tooltipRef}
			class="absolute z-50 rounded bg-zinc-700 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg {positions[
				position
			]} {className}"
			role="tooltip"
		>
			{content}
			<div class="absolute border-4 {arrows[position]}"></div>
		</div>
	{/if}
</div>
