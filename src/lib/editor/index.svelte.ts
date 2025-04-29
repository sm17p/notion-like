// place files you want to import through the `$lib` alias in this folder.
import { debounce } from "radash";
import { INPUT_TYPE_WHITELIST } from "./commands.svelte";
import { RootNode } from "./nodes.svelte";


export class Editor implements App.Editor {
	root: App.RootNode;
	rootDomNode: HTMLDivElement = $state() as HTMLDivElement;
	#db: App.DB;
	selectedNode?: App.RootNode | App.BlockNode | App.TextNode;
	debouncedSyncDB?: () => void;
	// #version = $state(0);

	constructor(note_slug: string, db: App.DB, editorNoteData?: App.RootNodeSerDe) {
		this.#db = db;
		this.debouncedSyncDB = debounce({ delay: 300 }, this.sync_db.bind(this));
		this.root =  new RootNode(note_slug, editorNoteData?.content, editorNoteData?.children);
	}

	static create_note(db: App.DB): Editor {
		const slug = crypto.randomUUID();
		let editor = new Editor(slug, db);
		editor.sync_db();
		return editor;
	}

	sync_db = () => {
		console.log("🚀 ~ Editor ~ sync_db ~ sync_db:")
		this.#db.setUserNote(this);
	}

	sync = () => {
		// console.log("🚀 ~ Editor ~ sync:");
		// debounce({ delay: 1000 }, () => this.sync_db());
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
		const { inputType} = event;
		// console.log('🚀 ~ onbeforeinput ~ event:', inputType, data);
		if (INPUT_TYPE_WHITELIST.has(inputType)) {
			this.selectedNode?.handleEvent(event);
			this.debouncedSyncDB?.();
		} else {
			event.preventDefault();
		}
	};

	onclick = (event: MouseEvent) => {
		this.setSelectedNode(event);
	}

	onpaste(event: ClipboardEvent) {
		console.log('🚀 ~ onpaste ~ event:', event, event.clipboardData?.getData('text/plain'));
	};

	onkeypress(event: KeyboardEvent) {
		console.log("🚀 ~ onkeypress ~ event:", event);
	}

	onkeydown(event: KeyboardEvent) {
		// const element = document.querySelector(".editor-divider")!;
		// const selection = document.getSelection()!;
		// const range = document.createRange();
		// console.log("🚀 ~ onkeydown ~ event:", selection, event, event.key, element);

		// range.setStart(element, element.childNodes.length);
		// range.collapse(true);

		// selection.removeAllRanges();
		// selection.addRange(range);
		if (event.key === 'Tab') {
			event.preventDefault();
		}
	}

	onkeyup(event: KeyboardEvent) {
		console.log("🚀 ~ onkeyup ~ event:", event);
	}

	onselectionchange(event: Event) {
		const selection = document.getSelection();
		console.log('🚀 ~ onselectionchange ~ event:', event, selection, selection?.direction);
	}

	setSelectedNode = (event: FocusEvent | Event) => {
		const target = event.target as HTMLElement;
		const id = target?.dataset.id;
		console.log('🚀 ~ onclick ~ event:', target, event, target?.dataset.id, window.getSelection(), target.classList.contains('editor'));

		if (target.classList.contains('editor') && this.root.children.length == 0) {
			this.root.addChild();
		}

		if (id !== undefined) {
			this.selectedNode = this.root.findNode(id);
		} else {
			this.selectedNode = this.root;
		}
		
		console.log("🚀 ~ Editor ~ selectedNode:", this.selectedNode);
	}

}


