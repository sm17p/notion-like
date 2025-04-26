
<script lang="ts">
    import type { ClipboardEventHandler, FormEventHandler } from "svelte/elements";

  const oninput: FormEventHandler<HTMLDivElement> = (event: Event) => {
    const { inputType, data } = event as InputEvent;
    console.log("🚀 ~ oninput ~ event:", inputType, data, event);
  };

  const onpaste: ClipboardEventHandler<HTMLDivElement> = (event: ClipboardEvent) => {
    console.log("🚀 ~ onpaste ~ event:", event, event.clipboardData);
  }

</script>


<div class="editor border-2 border-amber-300 h-full text-left min-h-60 px-20 py-8" contenteditable="true" {oninput} {onpaste}>

</div>
