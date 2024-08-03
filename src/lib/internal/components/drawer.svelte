<script lang="ts">
	import { page } from '$app/stores';
	import { cn, type NavigationLink, type NavigationLinkHeader } from '$lib/internal/index.js';
	import { ChevronRight, ArrowLeft } from 'lucide-svelte';
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
			if ($page.url.pathname !== link.href) continue;

			link_opened = link.text;

			break;
		}
	});
</script>

<button
	class={cn(
		'fixed top-0 bottom-15 left-0 right-0 z-100 transition-all w-screen overflow-hidden',
		open ? 'bg-white/75' : 'pointer-events-none'
	)}
></button>

<div
	class={cn(
		'fixed top-0 bottom-15 left-0 right-0 flex flex-col justify-end z-200 transition-all w-screen max-w-screen overflow-hidden',
		open ? '' : 'translate-y-full pointer-events-none'
	)}
>
	<div class="relative">
		<div
			class={cn(
				'bg-white w-screen transition-all absolute z-0 bottom-0 left-0 right-0 rounded-t-lg border-t',
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
				<div class="w-full px-2 py-4 space-y-4" bind:clientHeight={main_menu_height}>
					{#each links || [] as link}
						{#if !('type' in link)}
							<div class="px-4 flex gap-2">
								<a
									href={link.href}
									class="flex-grow font-light"
									onclick={() => {
										open = false;
										link_opened = link.text;
									}}
								>
									{link.text}
								</a>

								<button
									class="w-10 grid place-items-center"
									onclick={() => (link_opened = link.text)}
								>
									<ChevronRight size={16} />
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
							'sticky px-4 py-4 top-0 bg-white w-full text-lg rounded-t-lg border-t transition'
						)}
					>
						{link_opened}
					</div>

					{#each content as header}
						<div class="pb-4">
							<header class="px-4 text-sm font-medium text-black/75 tracking-wide">
								{header.header}
							</header>

							<ul class="px-4">
								{#each header.links as link}
									{@const href = header.base ? join(header.base, link.href) : link.href}
									<li>
										<a
											{href}
											class={cn(
												'font-light block py-1 px-2 mt-1 rounded',
												href === $page.url.pathname
													? 'bg-orange/25 text-orange-700'
													: 'text-black/80'
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
							'font-light sticky bottom-0 bg-white w-full py-2 px-4 border-t flex items-center gap-2 text-sm transition'
						)}
						onclick={() => (link_opened = '')}
					>
						<ArrowLeft size={16} class="text-black/75" />

						<span> Back to main menu </span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
