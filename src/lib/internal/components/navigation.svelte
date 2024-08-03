<script lang="ts">
	import { cn, type NavigationLink, Drawer } from '$lib/internal/index.js';
	import type { Snippet } from 'svelte';
	import { Menu, X } from 'lucide-svelte';

	type Props = {
		links?: NavigationLink[];
		logo?: Snippet;
	};

	const { links, logo }: Props = $props();
	let is_menu_open = $state(false);

	$effect(() => {
		document.body.style.overflow = is_menu_open ? 'hidden' : 'auto';
	});
</script>

<Drawer bind:open={is_menu_open} {links} />

<nav
	class={cn(
		'w-screen max-w-screen overflow-hidden bg-white border-t fixed bottom-0 sm:(border-b border-t-0 sticky top-0) z-200 transition',
		is_menu_open ? 'border-transparent' : ''
	)}
>
	<div class="flex h-15 items-center pl-4 max-w-screen w-screen overflow-hidden">
		{#if logo}
			<div>
				{@render logo()}
			</div>
		{/if}

		<div class="flex-grow"></div>

		<button
			class={cn('h-15 w-15 sm:hidden flex items-center justify-center')}
			onclick={() => (is_menu_open = !is_menu_open)}
		>
			{#if is_menu_open}
				<X size={20} />
			{:else}
				<Menu size={20} />
			{/if}
		</button>
	</div>
</nav>
