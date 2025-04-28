// place files you want to import through the `$lib` alias in this folder.

export class Editor implements App.Editor {
    root = $state<App.RootNode>() as App.RootNode;
	#db: App.DB;
	// #version = $state(0);

    constructor(note_slug: string, db: App.DB, root?: App.RootNode) {
        this.root = root ?? new RootNode(note_slug);
		// this.#history = $state();
		this.#db = db;
    }

	static create_note(db: App.DB): Editor {
		const slug = crypto.randomUUID();
		let note = new Editor(slug, db);
		note.sync_db();
		return note;
	}

	sync_db() {
		this.#db.setUserNote(this);
	}

	get id(): string {
		return this.root.id;
	}

	get title(): string {
		return this.root.title;
	}

}

class RootNode implements App.RootNode {
	#id: string;
	title: string;
	children: App.Node[];
	// this.#version;
	// Component: h1

	constructor(note_slug: string, title: string = "", children: App.Node[] = []) {
		this.#id = note_slug;
		this.title = title;
		this.children = [
			{
				id: crypto.randomUUID(),
				element: 'h2',
				content: '',
				children: []
			},
			{
				id: crypto.randomUUID(),
				element: 'p',
				children: [
					{
						id: crypto.randomUUID(),
						element: 'span',
						content: 'Wollah',
						children: []
					}
				]
			}
		];
	}

	get id(): string {
		return this.#id;
	}
}