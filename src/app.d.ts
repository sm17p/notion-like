// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="svelte" />
/// <reference types="svelte/animate" />
/// <reference types="svelte/easing" />
/// <reference types="svelte/motion" />
/// <reference types="svelte/store" />
/// <reference types="svelte/transition" />
/// <reference types="vite/client" />

import type { Component } from "svelte";

declare global {
	namespace App {
		interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Editor {
			// version: number;
			root: RootNode;
			id: string;
			title: string;
			sync_db: () => void;
		}

		type NotesList = {
			id: string;
			title: string;
		}

		type NoteMetaData = {
			id: string;
			title: string;
		}

		type Node = {
			id: string;
			content?: string;
			children: Node[];
			element: string;
		}

		interface RootNode extends Pick<Node, "id" | "children"> {
			id: string,
			title: string,
		}

		interface LineBreak extends Pick<Node, "id"> {
			element: "br";
		}

		interface DB {
			getUserNotes: () => NotesList[] | Error;
			has: (note_slug: string) => boolean;
			getUserNote: (note_slug: string) => Editor | Error;
			setUserNote: (note: Editor) => void | Error;
			deleteUserNote: (note_slug: string) => void | Error;
			// saveUserNote: () =>
		}

	}
}

export {};
