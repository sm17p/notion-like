import { Editor } from '$lib/editor/index.svelte';


export class LocalStorage implements App.DB {
	constructor() {
	}

	deleteUserNote(note_slug: string) {
		localStorage.removeItem(note_slug);
	}

    getUserNotes(): Omit<App.RootNodeSerDe, 'element'| 'children'>[] {
        const values: Omit<App.RootNodeSerDe, 'element'| 'children'>[] = [];
        
		for (const key of Object.keys(localStorage)) {
			if (this.has(key)) {
				try {
					const editorNoteData = this.getJson(key);
					values.push({
						id: key,
						content: (editorNoteData.content.length > 0 ? editorNoteData.content : "New Doc") as string,
					});
				} catch(err) {
					console.log("🚀 ~ LocalStorage<T> ~ getUserNotes ~ err:", err);
				}
			}
        }  

        return values;
    }

	getJson(note_slug: string): App.RootNodeSerDe  {
		const editorNoteData: App.RootNodeSerDe = JSON.parse(localStorage.getItem(note_slug)!);
		return editorNoteData
	}

	getUserNote(note_slug: string): App.Editor {
		const editorNoteData: App.RootNodeSerDe = this.getJson(note_slug);
		return new Editor(note_slug, this, editorNoteData);
	}

    has(note_slug: string): boolean {
        return this.#valid_note_id(note_slug);
    }

	setUserNote(note: App.Editor) {
		console.log("🚀 ~ LocalStorage ~ setUserNote ~ note:", note.root.content, JSON.stringify(note.root));
		localStorage.setItem(note.id, JSON.stringify(note.root))
	}

	#valid_note_id(note_slug: string): boolean {
		const uuidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		return note_slug.length === 36 && uuidRegex.test(note_slug) && localStorage.getItem(note_slug) !== null;
	}

}