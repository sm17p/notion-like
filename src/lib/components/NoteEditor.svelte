<script lang="ts">
	import { BlockNode, TextNode } from '$lib/editor/nodes.svelte';
	import * as svelteDND  from '@thisux/sveltednd';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import './editor.css';

	const { draggable, droppable } = svelteDND;

	interface Props {
		editor: App.Editor;
	}

	let { editor }: Props = $props();

	const __DEV__ = import.meta.env.DEV;

</script>

<svelte:document onselectionchange={editor.onselectionchange} />
<!-- {#if __DEV__} -->
	<div class="fixed top-0 right-0 text-right grid text-sm px-2 bg-amber-100 text-black">
		<span>Debug Info: Selected Node</span>
		<span>{editor.selectedNode?.id ?? 'N.A.'}</span>
		<span>{editor.selectedNode?.element}</span>
		<span>{editor.inputType}</span>
	</div>
<!-- {/if} -->

<!-- Current layout blocks editing -->
<!-- use:draggable={{ container: index.toString(), dragData: node, disabled: !isBlockNode  }}
		use:droppable={{
			container: index.toString(),
			callbacks: { onDrop: editor.ondrop },
			disabled: !isBlockNode
		}} -->

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
	class="editor h-full min-h-60 border-2 border-amber-300 px-20 py-8 text-left select-text cursor-default"
	contenteditable="true"
	onbeforeinput={editor.onbeforeinput}
	onclick={editor.onclick}
	onkeydown={editor.onkeydown}
	onpaste={editor.onpaste}
	bind:this={editor.rootDomNode}
	role="textbox"
>
	<h1 class="cursor-text" aria-placeholder="Title..." data-id={editor.id}>{editor.content}</h1>
	<hr class="editor-divider select-none">
	{@render Nodes(editor.children)}
</div>

{#snippet Nodes(nodes: App.RootNode['children'] | App.BlockNode['children'])}
	{#each nodes as node, index (node.id)}
	{@const isBlockNode = node instanceof BlockNode}
	{@const isTextNode = node instanceof TextNode}
	<svelte:element
		aria-placeholder={isBlockNode ? "Write..." : undefined}
		class={["cursor-text", {"transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-200 svelte-dnd-touch-feedback": isBlockNode, "whitespace-pre-wrap select-text break-all" : isTextNode}]}
		data-id={node.id}
		this={node.element}
		animate:flip={{ duration: 200 }}
		in:fade={{ duration: 150 }}
		out:fade={{ duration: 150 }}
		data-text={isTextNode ? true : undefined}
	>
			{#if isTextNode}
				{node.content}
			{:else if isBlockNode}
				{@render Nodes(node.children)}
			{/if}
		</svelte:element>
	{/each}
{/snippet}
