import type NoteEditor from '$lib/components/NoteEditor.svelte';
import { Editor } from '$lib/editor/index.svelte';
import { tick } from 'svelte';


export class LocalStorage implements App.DB {
	// #key: string;
	#listeners = 0;
	// #value: T | undefined;

	// #handler = (e: StorageEvent) => {
	// 	if (e.storageArea !== localStorage) return;
	// 	if (e.key !== this.#key) return;

	// 	this.#version += 1;
	// };

	constructor() {
	}

	// get current() {
	// 	this.#version;

	// 	const root =
	// 		typeof localStorage !== 'undefined'
	// 			? JSON.parse(localStorage.getItem(this.#key) as any)
	// 			: this.#value;

	// 	const proxies = new WeakMap();

	// 	const proxy = (value: unknown) => {
	// 		if (typeof value !== 'object' || value === null) {
	// 			return value;
	// 		}

	// 		let p = proxies.get(value);

	// 		if (!p) {
	// 			p = new Proxy(value, {
	// 				get: (target, property) => {
	// 					this.#version;
	// 					return proxy(Reflect.get(target, property));
	// 				},
	// 				set: (target, property, value) => {
	// 					this.#version += 1;
	// 					Reflect.set(target, property, value);

	// 					if (typeof localStorage !== 'undefined') {
	// 						localStorage.setItem(this.#key, JSON.stringify(root));
	// 					}

	// 					return true;
	// 				}
	// 			});

	// 			proxies.set(value, p);
	// 		}

	// 		return p;
	// 	};

	// 	if ($effect.tracking()) {
	// 		$effect(() => {
	// 			if (this.#listeners === 0) {
	// 				window.addEventListener('storage', this.#handler);
	// 			}

	// 			this.#listeners += 1;

	// 			return () => {
	// 				tick().then(() => {
	// 					this.#listeners -= 1;
	// 					if (this.#listeners === 0) {
	// 						window.removeEventListener('storage', this.#handler);
	// 					}
	// 				});
	// 			};
	// 		});
	// 	}

	// 	return proxy(root);
	// }

	// set current(value) {
	// 	if (typeof localStorage !== 'undefined') {
	// 		localStorage.setItem(this.#key, JSON.stringify(value));
	// 	}

	// 	this.#version += 1;
	// }

	deleteUserNote(note_slug: string) {
		localStorage.removeItem(note_slug);
	}

    getUserNotes(): App.NotesList[] {
        const values: App.NotesList[] = [];
        
		for (const key of Object.keys(localStorage)) {
			if (this.has(key)) {
				try {
					const editorData = this.getUserNote(key);
					values.push({
						id: editorData.id,
						title: editorData.title,
					});
					console.log("🚀 ~ LocalStorage<T> ~ getUserNotes ~ key of:", key, editorData);
				} catch(err) {
					console.log("🚀 ~ LocalStorage<T> ~ getUserNotes ~ err:", err);
				}
			}
        }  

        return values;
    }

	getUserNote(note_slug: string): App.Editor {
		const editorData = JSON.parse(localStorage.getItem(note_slug)!);
		return new Editor(note_slug, this);
	}

    has(note_slug: string): boolean {
        return this.#valid_note_id(note_slug);
    }

	setUserNote(note: App.Editor) {
		localStorage.setItem(note.id, JSON.stringify(note.root))
	}

	#valid_note_id(note_slug: string): boolean {
		const uuidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		return note_slug.length === 36 && uuidRegex.test(note_slug) && localStorage.getItem(note_slug) !== null;
	}

}