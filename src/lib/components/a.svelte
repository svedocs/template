<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/index.js';

	type Props = {
		children?: Snippet;
		href: string;
		rel?: string;
		class?: string | string[];
	};

	const { children, href, rel, class: klass, ...restProps }: Props = $props();
</script>

<a {href} {rel} class={cn('', klass)} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</a>
