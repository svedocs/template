<script lang="ts">
	import { page } from '$app/state';
	import { cn, type NavigationLink, type NavigationLinkHeader } from '$lib/index.js';
	import { CaretRight, ArrowLeft } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { join } from 'pathe';

	type Props = { open?: boolean; links?: NavigationLink[] };

	let { links, open = $bindable(false) }: Props = $props();
	let link_opened = $state('');
	let main_menu_height = $state(0);
	let content_height = $state(0);

	const content = $derived.by<NavigationLinkHeader[]>(() => {
		if (!link_opened) return [];

		const res = links?.find((v) => !('type' in v) && link_opened === v.text);

		return (res as NavigationLink).headers || [];
	});

	onMount(() => {
		for (const link of links || []) {
			if ('type' in link) continue;
			if (page.url.pathname !== link.href) continue;

			link_opened = link.text;

			break;
		}
	});
</script>

<button
	class={cn(
		'fixed top-0 bottom-15 left-0 right-0 z-100 transition-all w-screen overflow-hidden',
		open ? 'bg-white/75 dark:(bg-stone-900/75) backdrop-blur' : 'pointer-events-none'
	)}
	aria-label="Close"
></button>

<div
	class={cn(
		'fixed top-0 bottom-15 left-0 right-0 flex flex-col justify-end z-100 transition-all w-screen max-w-screen overflow-hidden',
		open ? '' : 'translate-y-full pointer-events-none'
	)}
>
	<div class="relative">
		<div
			class={cn(
				'bg-white w-screen transition-all absolute z-0 bottom-0 left-0 right-0 rounded-t-lg border-t',
				'dark:(bg-stone-900 border-stone-800)',
				link_opened ? '' : 'transition-delay-0'
			)}
			style:height={`${link_opened ? content_height : main_menu_height}px`}
		></div>

		<div
			class={cn(
				'grid grid-cols-2 w-200% transition-all',
				link_opened ? '-translate-x-1/2 transition-delay-0' : ''
			)}
		>
			<div class={cn('flex items-end z-1 max-h-xl', link_opened ? 'opacity-0' : '')}>
				<div class="w-full pt-4 pb-2" bind:clientHeight={main_menu_height}>
					{#each links || [] as link}
						{#if !('type' in link)}
							<div class="flex">
								<svelte:element
									this={link.href ? 'a' : 'div'}
									href={link.href}
									role={link.href ? 'link' : 'button'}
									class="flex-grow font-light py-2 pl-4 sm:(pl-8)"
									onclick={() => {
										if (link.href) open = false;
										link_opened = link.text;
									}}
								>
									{link.text}
								</svelte:element>

								<button
									class="w-13 sm:w-21 grid place-items-center"
									onclick={() => (link_opened = link.text)}
								>
									<CaretRight size={16} />
								</button>
							</div>
						{:else if link.type === 'border'}
							<hr />
						{:else if link.type === 'header'}
							<div>{link.text}</div>
						{/if}
					{/each}
				</div>
			</div>

			<div
				class={cn(
					'flex flex-col justify-end z-1 max-h-xl transition',
					link_opened ? '' : 'opacity-0'
				)}
			>
				<div
					class="w-full max-h-full overflow-x-hidden overflow-y-auto"
					bind:clientHeight={content_height}
				>
					<div
						class={cn(
							'sticky px-4 sm:px-8 py-4 top-0 w-full text-lg rounded-t-lg border-t transition dark:border-stone-800'
						)}
					>
						{link_opened}
					</div>

					{#each content as header}
						<div class="pb-4">
							<header
								class="px-4 sm:px-8 text-sm font-medium text-black/75 dark:(text-white/75) tracking-wide"
							>
								{header.header}
							</header>

							<ul class="px-4 sm:px-8">
								{#each header.links as link}
									{@const href = header.base ? join(header.base, link.href) : link.href}
									<li>
										<a
											{href}
											class={cn(
												'font-light block py-1 px-2 mt-1 rounded',
												href === page.url.pathname
													? 'bg-orange/25 text-orange-700'
													: 'text-black/80 dark:(text-white/80)'
											)}
											onclick={() => {
												open = false;
											}}
										>
											{link.text}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}

					<button
						class={cn(
							'font-light sticky bottom-0 w-full py-2 px-4 sm:px-8 border-t dark:(border-stone-800) flex items-center gap-2 text-sm transition'
						)}
						onclick={() => (link_opened = '')}
					>
						<ArrowLeft size={16} class="text-black/75 dark:(text-white/75)" />

						<span> Back to main menu </span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
