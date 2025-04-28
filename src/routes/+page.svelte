<script lang="ts">
	import { goto } from "$app/navigation";
	import { Editor } from "$lib/editor/index.svelte";
  import DB from "$lib/db/index.svelte";
	import type { PageProps } from "./$types";

  function createNewNote() {
    let note = Editor.create_note(DB);
    goto(`/${note.id}/`);
  }

  let { data }: PageProps = $props()
  console.log("🚀 ~ data:", data);

</script>


<div>
  <h1 class="text-prose">Notion Like!</h1>
  <button class="border-1 p-2 rounded-md cursor-pointer" onclick={createNewNote}>New</button>
  <hr>
  <nav>
    <ol>
      {#each data.notes as note (note.id)}
      <li>
        <a href={`/${note.id}/`}>
          {note.title}
        </a>
      </li>
      {/each}
    </ol>
  </nav>
</div>