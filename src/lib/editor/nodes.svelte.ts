import { editor, selectedBlockNode } from "./store.svelte";

type Node = App.RootNode | App.BlockNode | App.LineBreakNode | App.TextNode;

export class LineBreakNode implements App.LineBreakNode {
	id: string;
	element: App.LineBreakNode["element"];

	constructor(id: string = crypto.randomUUID(), element: App.TextNode['element'] = 'br') {
		this.id = id;
		this.element = element;
	}

	toJSON = (): App.LineBreakNodeSerDe => {
		return {
			id: this.id,
			element: this.element,
		};
	}
}

export class TextNode implements App.TextNode {
	id: string;
	element: App.TextNode['element'] = 'span';
	content: string = $state('');

	constructor(id: string = crypto.randomUUID(), element: App.TextNode['element'] = 'span', content: string = '') {
		this.id = id;
		this.element = element;
		this.content = content;
	}

	handleEvent = (event: InputEvent | MouseEvent | KeyboardEvent): void => {
		if (event instanceof InputEvent) {
			this.inputEventHandler(event);
		} else if (event instanceof MouseEvent) {
			this.mouseEventHandler(event);
		} else if (event instanceof KeyboardEvent) {
			this.keyboardEventHandler(event);
		} else {
			console.log("🚀 ~ unhandled ~ event:", event);
		}
	}

	inputEventHandler = (event: InputEvent): void => { 
		const { inputType, data, target, ...rest } = event;
		const selection = document.getSelection()!;
		console.log('🚀 ~ TextNode ~ event:', event, inputType, data, document.getSelection(), target, rest, editor.current);
		let currentIndex = selection.anchorOffset - 1;
		switch (inputType) {
			case "insertText":
				this.content = this.content.slice(0, currentIndex + 1) + data + this.content.slice(currentIndex + 1);
				break;
			case "deleteContentBackward":
				if (currentIndex < 0 || currentIndex > this.content.length) break;

				this.content = this.content.slice(0, currentIndex) + this.content.slice(currentIndex + 1);
				break;
			case "insertLineBreak":
				selectedBlockNode.current?.addLineBreakNode();
			default:
		}
		event.preventDefault();
	}

	mouseEventHandler = (event: MouseEvent): void => { }

	keyboardEventHandler = (event: KeyboardEvent): void => { }

	toJSON = (): App.TextNodeSerDe => {
		return {
			id: this.id,
			element: this.element,
			content: this.content,
		};
	}

}


export class BlockNode implements App.BlockNode {
	id: string;
	element: App.BlockNode['element'];
	children: App.BlockNode['children'] = $state([]);

	constructor( id: string = crypto.randomUUID(), element: App.BlockNode['element'] = 'p', children: App.BlockNodeSerDe['children'] = []) {
		this.id = id;
		this.element = element;
		this.children = children.map(node => {
			if (node.element === "br")  {
				return new LineBreakNode(node.id, node.element);
			} else {
				return new TextNode(node.id, node.element, (node as App.TextNodeSerDe).content);
			}
		});
	}

	handleEvent = (event: InputEvent | MouseEvent | KeyboardEvent): void => {
		if (event instanceof InputEvent) {
			this.inputEventHandler(event);
		} else if (event instanceof MouseEvent) {
			this.mouseEventHandler(event);
		} else if (event instanceof KeyboardEvent) {
			this.keyboardEventHandler(event);
		} else {
			console.log("🚀 ~ unhandled ~ event:", event);
		}
	}

	addChild = (index: number, child: TextNode | LineBreakNode): string => {
		this.children.splice(index, 0, child);
		return child.id;
	};

	addLineBreakNode = (index?: number): string => {
		let node = new LineBreakNode();
		return this.addChild(index ?? this.children.length, node);
	}
	
	addTextNode = (index?: number, content?: string) => {
		let id = crypto.randomUUID()
		let node = new TextNode(id, 'span', content);
		return this.addChild(index ?? this.children.length, node);
	};

	inputEventHandler = (event: InputEvent): void => {
		const { inputType, data, target, ...rest } = event;
		const selection = document.getSelection();
		console.log('🚀 ~ BlockNode ~ event:', inputType, data, document.getSelection(), target, rest);

		if (inputType === "insertText") {
			if (this.children.length === 0) {
				this.addTextNode(0, data!);
			}
		}
		event.preventDefault();
	}

	mouseEventHandler = (event: MouseEvent): void => { }

	keyboardEventHandler = (event: KeyboardEvent): void => { }

	toJSON = (): App.BlockNodeSerDe => {
		return {
			id: this.id,
			element: this.element,
			children: this.children.map(node => (node as App.LineBreakNode | App.TextNode).toJSON()),
		};
	}

}


export class RootNode implements App.RootNode {
	#id: string;
	content: string = $state('');
	children = $state<App.RootNode['children']>([]);
	element: App.RootNode['element'] = 'h1';

	constructor(note_slug: string, content: string = '', children: App.RootNodeSerDe['children'] = []) {
		this.#id = note_slug;
		this.content = content;
		this.children = children?.map(node => {
			return new BlockNode(node?.id, node.element, node.children)
		});
	}

	get id(): string {
		return this.#id;
	}

	addChild = (index?: number): string => {
		let id = crypto.randomUUID();
		this.children.splice(index ?? this.children.length, 0, new BlockNode(id));
		console.log("🚀 ~ RootNode ~ children:", this.children);
		return id;
	}

	handleEvent = (event: InputEvent | MouseEvent | KeyboardEvent): void => {
		if (event instanceof InputEvent) {
			this.inputEventHandler(event);
		} else if (event instanceof MouseEvent) {
			this.mouseEventHandler(event);
		} else if (event instanceof KeyboardEvent) {
			this.keyboardEventHandler(event);
		} else {
			console.log("🚀 ~ unhandled ~ event:", event);
		}
	}

	findNode = (id: string): Exclude<Node, App.LineBreakNode> => {
		// BFS to find node
		const queue: Node[] = [...this.children];
		const visited: Set<Node> = new Set();

		let found: Node = this;

		while (queue.length > 0) {
			const currentElement: Node = queue.shift()!; // '!' asserts that the queue is not empty

			if (currentElement.id === id) {
				found = currentElement as Exclude<Node, LineBreakNode>
			};

			if (!visited.has(currentElement)) {
				visited.add(currentElement);

				if (currentElement instanceof LineBreakNode || currentElement instanceof TextNode) {
					continue;
				} else if (currentElement instanceof BlockNode) {
					// Assuming the children of a node are its direct element children
					queue.push(...currentElement.children);
				}
			}
		}

		return found as Exclude<Node, App.LineBreakNode>;
	}

	inputEventHandler = (event: InputEvent): void => {
		const { inputType, data, target, ...rest } = event;
		const selection = document.getSelection()!;
		console.log('🚀 ~ RootNode ~ event:', event, inputType, data, document.getSelection(), target, rest);
		let currentIndex = selection.anchorOffset - 1;
		let childId: string;

		switch (inputType) {
			case "insertText":
				this.content = this.content.slice(0, currentIndex + 1) + data + this.content.slice(currentIndex + 1);
				break;
			case "deleteContentBackward":
				if (currentIndex < 0 || currentIndex > this.content.length) break;
				this.content = this.content.slice(0, currentIndex) + this.content.slice(currentIndex + 1);
				break;
			case "insertParagraph":
			case "insertLineBreak":
				childId = this.addChild(0);
				// selection?.setPosition(selection.focusNode, selection.focusOffset);
			default:
		}
		event.preventDefault();
	}

	mouseEventHandler = (event: MouseEvent): void => { }

	keyboardEventHandler = (event: KeyboardEvent): void => {
	}

	toJSON = (): App.RootNodeSerDe => {
		return {
			id: this.id,
			content: this.content,
			element: this.element,
			children: this.children.map(node => (node as App.BlockNode).toJSON()),
		};
	}

}
