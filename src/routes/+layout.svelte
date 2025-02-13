<script lang="ts">
	import Navigation from '$lib/components/navigation.svelte';
	import '@unocss/reset/tailwind.css';
	import 'virtual:uno.css';
</script>

<Navigation
	links={[
		{
			text: 'Docs',
			headers: [
				{
					header: 'API',
					base: '/docs',
					links: [
						{
							text: 'Introduction',
							href: '/introduction'
						}
					]
				}
			]
		},
		{
			text: 'Examples',
			headers: [
				{
					header: 'API',
					base: '/examples',
					links: [
						{
							text: 'Introduction',
							href: '/introduction'
						}
					]
				}
			]
		}
	]}
>
	{#snippet logo()}
		<a class="text-lg" href="/">svedocs</a>
	{/snippet}
</Navigation>

<slot />
