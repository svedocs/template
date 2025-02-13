<script lang="ts">
	import { cn, type NavigationLink, Drawer } from '$lib/index.js';
	import { THEME_KEY, is_dark } from '$lib/stores.js';
	import { onMount, type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { List, X, Moon, Sun } from 'phosphor-svelte';
	const perfers_dark = new MediaQuery('(prefers-color-scheme: dark)');

	type Props = {
		links?: NavigationLink[];
		logo?: Snippet;
	};

	const { links, logo }: Props = $props();
	let is_menu_open = $state(false);

	$effect(() => {
		document.body.style.overflow = is_menu_open ? 'hidden' : 'auto';
		document.body.classList[$is_dark ? 'add' : 'remove']('dark');
	});

	if (typeof window !== 'undefined') {
		const theme = localStorage.getItem(THEME_KEY);
		if (theme === null) is_dark.set(perfers_dark.current);
		if (theme === 'dark') is_dark.set(true);
	}
</script>

<Drawer bind:open={is_menu_open} {links} />

<nav
	class={cn(
		'w-screen max-w-screen overflow-hidden bg-white border-t fixed bottom-0 md:(border-b border-t-0 sticky top-0) z-200 transition',
		'dark:(bg-stone-900)',
		is_menu_open ? 'border-transparent' : 'dark:(border-stone-800)'
	)}
>
	<div class="flex h-15 gap-8 items-center px-4 sm:px-8 max-w-screen w-screen overflow-hidden">
		{#if logo}
			{@render logo()}
		{/if}

		<div class="flex-grow"></div>

		<button
			class={cn('h-5 w-5 md:hidden flex items-center justify-center')}
			onclick={() => {
				is_dark.set(!$is_dark);
				localStorage.setItem(THEME_KEY, $is_dark ? 'light' : 'dark');
			}}
		>
			{#if $is_dark}
				<Moon size={20} />
			{:else}
				<Sun size={20} />
			{/if}
		</button>

		{is_menu_open}

		<button
			class={cn('h-5 w-5 md:hidden flex items-center justify-center')}
			onclick={() => (is_menu_open = !is_menu_open)}
		>
			{#if is_menu_open}
				<X size={20} />
			{:else}
				<List size={20} />
			{/if}
		</button>
	</div>
</nav>

<style>
	:global(body.dark) {
		@apply bg-stone-900 text-white;
	}
</style>
