<script lang="ts">
	interface MenuItem {
		label: string;
		icon?: string;
		href?: string;
		onClick?: () => void;
		disabled?: boolean;
		danger?: boolean;
	}

	interface Props {
		trigger: import('svelte').Snippet;
		items: MenuItem[];
		align?: 'left' | 'right';
		class?: string;
	}

	let { trigger, items, align = 'left', class: className = '' }: Props = $props();

	let isOpen = $state(false);
	let menuRef = $state<HTMLElement>();
	let triggerRef = $state<HTMLElement>();

	const alignments = {
		left: 'left-0',
		right: 'right-0'
	};

	function toggle() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}

	function handleItemClick(item: MenuItem) {
		if (item.disabled) return;
		if (item.onClick) {
			item.onClick();
		}
		close();
	}

	// Close on escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		}
	}

	// Close when clicking outside
	function handleClickOutside(e: MouseEvent) {
		if (
			menuRef &&
			!menuRef.contains(e.target as Node) &&
			triggerRef &&
			!triggerRef.contains(e.target as Node)
		) {
			close();
		}
	}

	// Add click outside listener when open
	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative inline-block">
	<div bind:this={triggerRef} onkeydown={(e) => e.key === 'Enter' && toggle()}>
		{@render trigger()}
	</div>

	{#if isOpen}
		<div
			bind:this={menuRef}
			class="absolute z-50 mt-2 w-56 rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-xl {alignments[
				align
			]} {className}"
			role="menu"
		>
			{#each items as item (item.label)}
				{#if item.href}
					<!-- eslint-disable-next-line sveltejs-valid-derive-classes -->
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2 text-sm transition-colors {item.disabled
							? 'cursor-not-allowed text-zinc-500'
							: item.danger
								? 'text-red-400 hover:bg-red-900/20'
								: 'text-zinc-300 hover:bg-zinc-700'}"
						onclick={() => handleItemClick(item)}
						role="menuitem"
						aria-disabled={item.disabled}
					>
						{#if item.icon}
							<span class="text-lg">{item.icon}</span>
						{/if}
						{item.label}
					</a>
				{:else}
					<button
						disabled={item.disabled}
						class="flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors {item.disabled
							? 'cursor-not-allowed text-zinc-500'
							: item.danger
								? 'text-red-400 hover:bg-red-900/20'
								: 'text-zinc-300 hover:bg-zinc-700'}"
						onclick={() => handleItemClick(item)}
						role="menuitem"
						aria-disabled={item.disabled}
					>
						{#if item.icon}
							<span class="text-lg">{item.icon}</span>
						{/if}
						{item.label}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
