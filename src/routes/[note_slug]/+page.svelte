<script lang="ts">
	import NoteEditor from "$lib/components/NoteEditor.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    console.log("🚀 ~ data:", data);
</script>


<NoteEditor editor={data.note} />