<script lang="ts">
	import { Navigation } from '$lib/internal/index.js';
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
		}
	]}
>
	{#snippet logo()}
		<a href="/">svedocs</a>
	{/snippet}
</Navigation>

<slot />
