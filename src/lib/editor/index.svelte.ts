// place files you want to import through the `$lib` alias in this folder.
import { debounce } from "radash";
import type { DragDropState } from '@thisux/sveltednd';
import { INPUT_TYPE_WHITELIST } from "./commands.svelte";
import { RootNode } from "./nodes.svelte";
import { findNearestEditableNode } from "$lib/utils";
import { editor } from "./store.svelte";

export class Editor implements App.Editor {
	root: App.RootNode;
	rootDomNode: HTMLDivElement = $state() as HTMLDivElement;
	#db: App.DB;
	selectedNode?: App.RootNode | App.BlockNode | App.TextNode = $state();
	inputType: string = $state('');
	debouncedSyncDB?: () => void;
	// #version = $state(0);

	constructor(note_slug: string, db: App.DB, editorNoteData?: App.RootNodeSerDe) {
		this.#db = db;
		this.debouncedSyncDB = debounce({ delay: 300 }, this.sync_db.bind(this));
		this.root = new RootNode(note_slug, editorNoteData?.content, editorNoteData?.children);
		editor.current = this;
	}

	static create_note(db: App.DB): Editor {
		const slug = crypto.randomUUID();
		let editor = new Editor(slug, db);
		editor.sync_db();
		return editor;
	}

	sync_db = () => {
		console.log("🚀 ~ Editor ~ sync_db ~ sync_db:");
		this.#db.setUserNote(this);
	}

	get id(): string {
		return this.root.id;
	}

	get content(): string {
		return this.root.content;
	}

	get children(): App.RootNode['children'] {
		return this.root.children;
	}

	onbeforeinput = (event: InputEvent) => {
		const { inputType } = event;
		// console.log("🚀 ~ onbeforeinput ~ event:", event);
		if (INPUT_TYPE_WHITELIST.has(inputType)) {
			this.inputType = `WHITELIST:${inputType}`;
			this.selectedNode?.handleEvent(event);
			this.debouncedSyncDB?.();
			console.log("🚀 ~ onbeforeinput ~ event:", event);
			// const selection = document.getSelection()!;
			// const range = document.createRange();
			// console.log("🚀 ~ onbeforeinput ~ event:", selection.anchorOffset, selection, event);
			// range.setStart(selection.anchorNode?.parentElement!, selection.anchorNode?.parentElement?.childNodes.length!);
			// range.collapse(true);

			// selection.removeAllRanges();
			// selection.addRange(range);
		} else {
			this.inputType = `BLACKLIST:${inputType}`;

			console.log('🚀 ~ onbeforeinput ~ event ~ blacklist:', inputType);
		}
		event.preventDefault();
	};

	ondrop = (state: DragDropState<App.Node>) => {
		const { targetContainer, sourceContainer } = state;
		const dragIndex = parseInt(sourceContainer ?? -1);
		const dropIndex = parseInt(targetContainer ?? '0');
		console.log("🚀 ~ Editor ~ dropIndex:", dragIndex, dropIndex);
		if (dragIndex !== -1 && !isNaN(dropIndex)) {
			let arr = this.root.children;
			[arr[dragIndex], arr[dropIndex]] = [arr[dropIndex], arr[dragIndex]];
			this.debouncedSyncDB?.();
		}
	};

	onclick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const id = target?.dataset.id;
		const selection = document.getSelection();

		// Case 1: Clicked on selection -> anchorNode -> root

		// if (target.classList.contains('editor') && this.root.children.length == 0) {
		// 	this.root.addChild();
		// }

		let nearest = findNearestEditableNode(selection?.anchorNode ?? target);
		console.log('🚀 ~ onclick ~ event:', id, nearest?.dataset.id);
		console.log('🚀 ~ onclick ~ event:', selection?.anchorOffset, selection?.focusOffset);

		this.setSelectedNode(nearest?.dataset.id);
	}

	onpaste(event: ClipboardEvent) {
		console.log('🚀 ~ onpaste ~ event:', event, event.clipboardData?.getData('text/plain'));
	};

	onkeypress(event: KeyboardEvent) {
		console.log("🚀 ~ onkeypress ~ event:", event);
	}

	onkeydown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
		}
	}

	onkeyup(event: KeyboardEvent) {
	}

	onselectionchange = (event: Event) => {
		// Set nearest valid editable node
		const selection = document.getSelection()!;

		const nearestNode: HTMLElement | null = findNearestEditableNode(selection.anchorNode);
		console.trace("🚀 ~ Editor ~ onselectionchange:", selection.anchorNode, nearestNode);
		console.trace("🚀 ~ Editor ~ onselectionchange:", selection.anchorOffset, selection.focusOffset);


		this.setSelectedNode(nearestNode?.dataset.id);

	}

	setSelectedNode = (id?: string) => {
		if (this.selectedNode && id === this.selectedNode.id) {
			console.log("🚀 ~ Editor ~ selectedNode: skipped", id);
			return;
		}

		if (id !== undefined) {
			this.selectedNode = this.root.findNode(id);
		} else {
			this.selectedNode = this.root;
		}

		console.log("🚀 ~ Editor ~ selectedNode:", this.selectedNode);
	}
}


