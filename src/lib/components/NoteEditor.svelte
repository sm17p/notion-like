<script lang="ts">
	import { BlockNode, TextNode } from '$lib/editor/nodes.svelte';
	import { onMount } from 'svelte';
	import './editor.css';
	interface Props {
		editor: App.Editor;
	}

	let { editor }: Props = $props();

	function sync() {
		editor.sync_db();
	}
</script>

<svelte:document onselectionchange={editor.onselectionchange} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	class="editor h-full min-h-60 border-2 border-amber-300 px-20 py-8 text-left select-text"
	contenteditable="true"
	onbeforeinput={editor.onbeforeinput}
	onclick={editor.onclick}
	onkeydown={editor.onkeydown}
	onpaste={editor.onpaste}
	bind:this={editor.rootDomNode}
	role="textbox"
>
	<h1 aria-placeholder="Title..." data-id={editor.id}>{editor.content}</h1>
	<hr class="editor-divider select-none">
	{@render Nodes(editor.children)}
</div>

{#snippet Nodes(nodes: App.RootNode['children'] | App.BlockNode['children'])}
	{#each nodes as node (node.id)}
	<svelte:element data-id={node.id} this={node.element} aria-placeholder={node instanceof BlockNode ? "Write, '/' for commands..." : undefined}>
			{#if node instanceof TextNode}
				{node.content}
			{:else if node instanceof BlockNode}
				{@render Nodes(node.children)}
			{/if}
		</svelte:element>
	{/each}
{/snippet}
