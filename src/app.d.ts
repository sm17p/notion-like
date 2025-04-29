// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="svelte" />
/// <reference types="svelte/animate" />
/// <reference types="svelte/easing" />
/// <reference types="svelte/motion" />
/// <reference types="svelte/store" />
/// <reference types="svelte/transition" />
/// <reference types="@thisux/sveltednd" />
/// <reference types="vite/client" />

import type { BlockNode, LineBreakNode, LineBreakNode, RootNode, TextNode } from "$lib/editor/nodes.svelte";
import type { Component } from "svelte";

declare global {
	namespace App {
		interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface DB {
			getUserNotes: () => Omit<NotesMetaData, 'children'>[] | Error;
			has: (note_slug: string) => boolean;
			getUserNote: (note_slug: string) => Editor | Error;
			setUserNote: (note: Editor) => void | Error;
			deleteUserNote: (note_slug: string) => void | Error;
		}

		type RootHeadingElement = 'h1';

		type HeadingElements = 'h2' | 'h3' | 'h4';

		type ParagraphElements = 'p' | 'blockquote' | 'code';

		type ListElements = 'ol' | 'ul';

		type TextElements = 'span' | 'strong' | 'em';

		type ListItemElement = 'li';

		type DividerElement = 'hr';

		type LineBreakElement = 'br';


		interface BaseNodeSerDe {
			id: string;
			element: RootHeadingElement | HeadingElements | ListElements | ListItemElement | LineBreakElement | ParagraphElements | TextElements;
			// Mardown style editing
			markers?: RegExp[];
		}

		interface LineBreakNodeSerDe extends BaseNodeSerDe {
			element: LineBreakElement;
		}

		interface TextNodeSerDe extends BaseNodeSerDe {
			element: TextElement;
			content: string;
		}

		interface BlockNodeSerDe extends BaseNodeSerDe {
			element: HeadingElements | ParagraphElements | ListElements
			children: (TextNodeSerDe | LineBreakNodeSerDe)[]
		}

		interface RootNodeSerDe extends BaseNodeSerDe {
			element: HeadingElement
			content: string;
			children: BlockNodeSerDe[]
		}

		interface Node extends BaseNodeSerDe {
			handleEvent: (event: MouseEvent | InputEvent | KeyboardEvent) => void;
			inputEventHandler: (event: InputEvent) => void;
			mouseEventHandler: (event: MouseEvent) => void;
			keyboardEventHandler: (event: KeyboardEvent) => void;
			addChild: (index?: number) => void;
			changeNodeType?: () => void; 
			toJSON:() => void;
		}
		
		interface LineBreakNode extends Pick<Node, "toJSON">, LineBreakNodeSerDe {
			toJSON: () => LineBreakNodeSerDe;
		}
		
		interface TextNode extends Omit<Node, 'element' | 'children' | 'addChild'>, TextNodeSerDe {
			toJSON: () => TextNodeSerDe;
		}

		interface BlockNode extends Omit<Node, 'element'>, BlockNodeSerDe {
			children: (TextNode | LineBreakNode)[];
			toJSON: () => BlockNodeSerDe;
		}
		
		interface RootNode extends Omit<Node, 'element' | 'markers'>, RootNodeSerDe {
			children: BlockNode[];
			findNode: (id: string) => RootNode | BlockNode | TextNode;
			toJSON: () => RootNodeSerDe;
		}

		interface Editor extends Pick<RootNode, "id" | "content" | "children"> {
			// version: number;
			root: RootNode;
			rootDomNode: HTMLDivElement;
			sync_db: () => void;
			debouncedSyncDB?: () => void;
			onbeforeinput: EventHandler<InputEvent, HTMLDivElement>;
			onclick: MouseEventHandler<HTMLDivElement>;
			ondrop: (state: DragDropState<App.Node>) => Promise<void> | void
			onkeydown: KeyboardEventHandler<HTMLDivElement>;
			onkeypress: KeyboardEventHandler<HTMLDivElement>;
			onkeyup: KeyboardEventHandler<HTMLDivElement>;
			onpaste: ClipboardEventHandler<HTMLDivElement>;
			onselectionchange: EventHandler<Document>;
		}
	}
}

export {};
