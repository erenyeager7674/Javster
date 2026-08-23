<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		rounded?: string;
		class?: string;
	}

	let {
		width = 'w-full',
		height = 'h-4',
		rounded = 'rounded-md',
		class: className = ''
	}: Props = $props();
</script>

<span
	class="skeleton block {width} {height} {rounded} {className}"
	aria-hidden="true"
	role="presentation"
></span>
