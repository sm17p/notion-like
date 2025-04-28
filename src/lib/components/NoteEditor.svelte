
<script lang="ts">
    import './editor.css';
    import type { ClipboardEventHandler, FocusEventHandler, FormEventHandler, KeyboardEventHandler } from "svelte/elements";
  
    const onbeforeinput: FormEventHandler<HTMLDivElement> = (event: Event) => {
      const { inputType, data } = event as InputEvent;
      console.log("🚀 ~ onbeforeinput ~ event:", inputType, data, event, window.getSelection());
      // event.preventDefault();
    };
  
    const onpaste: ClipboardEventHandler<HTMLDivElement> = (event: ClipboardEvent) => {
      console.log("🚀 ~ onpaste ~ event:", event, event.clipboardData?.getData("text"),);
    }
  
    const onkeypress: KeyboardEventHandler<HTMLDivElement> = (event: KeyboardEvent) => {
      console.log("🚀 ~ onkeypress ~ event:", event);
    }
  
    const onkeydown: KeyboardEventHandler<HTMLDivElement> = (event: KeyboardEvent) => {
      console.log("🚀 ~ onkeydown ~ event:", event, event.key);
    }
  
    const onkeyup: KeyboardEventHandler<HTMLDivElement> = (event: KeyboardEvent) => {
      console.log("🚀 ~ onkeyup ~ event:", event);
    }

    const onclick: FocusEventHandler<HTMLDivElement> = (event: FocusEvent) => {
      console.log("🚀 ~ onkeyup ~ event:", event, event.target, window.getSelection());
    }

    interface Props {
      editor: App.Editor;
    }

    let { editor }: Props = $props();
    // editor.sync_db();
  </script>
  
  
  <div class="editor border-2 border-amber-300 h-full text-left min-h-60 px-20 py-8" contenteditable="true"
   {onbeforeinput} 
   {onpaste}
   {onkeydown}
   {onkeypress}
   {onkeyup}
   {onclick}
   role="textbox"
   tabindex="0"
   >

   <h1 aria-placeholder="Title..."></h1>
   <hr>
   {@render Nodes(editor.root.children)}
  
  </div>

{#snippet Nodes(nodes: App.Node[])}
  {#each nodes as node (node.id)}
    <svelte:element this={node.element} aria-placeholder="Write, '/' for commands">
      {node.content}
      {#if node.children?.length > 0}
        {@render Nodes(node.children)}
      {/if}
    </svelte:element>
  {/each}
{/snippet}