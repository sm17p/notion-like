<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<main class="bg-stone-100 dark:bg-stone-900 p-12 sm:px-20 min-h-screen flex">
	<article class="prose prose-neutral dark:prose-stone dark:prose-invert lg:prose-lg max-w-full flex-1">
		{@render children()}
	</article>
</main>
