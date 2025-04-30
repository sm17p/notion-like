export let editor = $state<{
    current: App.Editor | undefined
}>({
    current: undefined
});

export let selectedBlockNode = $state<{
    current: App.BlockNode | undefined
}>({
    current: undefined
});