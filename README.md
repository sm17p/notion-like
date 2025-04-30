# Notion-Style Doc Editor

## Requirements
- Task: Build a rich text editor that mimics the functionality and flexibility of Notion. Users should be able to add, edit, delete, and rearrange different types of content blocks such as text, headings, to-do lists, and more.
- Requirements: Support block-based editing with intuitive UI controls for adding and modifying content. Implement nested to-do lists to allow users to create hierarchies of tasks. Enable drag-and-drop functionality for re-positioning blocks easily.
- We encourage you to go beyond the basics and explore additional features such as keyboard shortcuts, markdown-style commands (e.g., typing `/` to open a block menu), and content persistence. Think about how you can elevate the editing experience and make it feel seamless and powerful.

## Guidelines
- Assignment Deadline: Sunday, 30th April 2025 (End of Day).
- Submission Method: Please share the GitHub repository link and the hosted web application link via email. Keep the Github repository private and add `https://github.com/SagarRajput-7` to the repo.
- Assignment Confidentiality: We kindly request that you maintain the confidentiality of this assignment, as it is intended for your evaluation as part of our recruitment process.


## Design Doc

### Features & Support
- Start page
    1. New
    2. Load
- CRUD for blocks
- Keyboard Shortcuts for CRUD operations
- Drag 'n' Drop for updates
- Sync with local storage
- rtl, ltr support
- Blocks
    1. Headings | h1 - h6
    2. Paragraphs p
    3. Lists | ol, ul
    4. Divider | hr
- Markdown style commands
- Undo / Redo

### Future support to take into account for architechting present solution
- [Input Method Editors](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)
- i18n
- Collaboration - Centralized vs P2P?
- Note sharing?
    1. De-facto, login auth centralized server
    2. URL as data store | JavaScript Object -> compression (ProtoBuf or MessagePack) -> query_params - url size limits? (URL characthers are ASCII encoded, 1 char -> 1 byte)
        - Google Chrome: Around 32,767 characters.   
        - Mozilla Firefox: Around 65,536 characters.   
        - Safari: Around 80,000 characters. Again, while technically supporting long URLs, keeping them concise is best practice.
        - Microsoft Edge: Similar to Chrome, around 32,767 characters. This is likely due to the shared Chromium engine.   
        - Google Android: Around 8,192 characters. 
- Spell Check, language tools web extensions? (Too far)



### How?
- Routing
    1. SPA
      - Handled via Sveltekit
    2. Routes
        1. / - Start Page
        2. /<note_slug>/ - Editor for doc with it's id determined by `note_slug`
            - If `note_slug` is not present redirect to the start page
        
- Data
    1. Ropes vs gap buffers vs piece tables vs n-ary trees
        - Go with N-ary tree, other's help with efficient file edits on a large file size which is out of scope for this project
    2. Persistence - Local storage vs IndexDB
        - LocaStorage - Can only store strings, synchronous and blocks main thread.
            - Chrome/Chromium/Edge: 5 MB per domain
            - Firefox: 10 MB per domain
            - Safari: 4-5 MB per domain (varies slightly between versions)
        - IndexDB + WebWorker + Broadcast Channel, is the ideal choice for a full fledged app. Supports running in web workers, but API is complicated and lacks support for syncing multi tab documents which can be resolved using the Broadcast Channel API. Out of scope for this project.
        - Sticking with LocalStorage, IndexedDB seems like an over-kill for this version considering the enormous amount of time needed to write the editor core logic. However, [RxDB](https://github.com/pubkey/rxdb) seems promising for writing the data persistence layer with it's flexible storage engine model which we can swap around.
    3. Creating a DB layer to handle synchronization with `LocalStorage` as a plugin which can be swapped later.

- View
    - Use contententeditable="true" on the parent for the work area
        - Map data to html elements

- Controller
    - Event Handler will stream events to the current node being edited. The node will be responsible to perform updates based on it.
    - Read [Input Event Types](https://w3c.github.io/input-events/#interface-InputEvent-Attributes) spec and scope out support for event types 
    - Read [Clipboard Event](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)
    - Read [Key Handling by browsers](https://unixpapa.com/js/key.html)
        - Outdated, many of the work-arounds are changed now
    - Over-riding browser shortcuts for content-editing? -> streamlining editing experiece accross browsers
        - https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/editing/editing_behavior.cc;l=94


- Learnings & Caveats
    1. Use beforeinput instead of input to override contenteditable - Browser Coverage 95.76% (IE + Chinese browsers are in the exclude list)
    2. Handling long-key press (Auto-Repeat) - Later, after editing and syncing works.
    3. Getting the current cursor position. On click -> turn on event subscriber for the node.
    4. As I'm reading through more, the behemoth of complexity behind a simple WYSIWIG editor using the current state of browsers seems a bbit astounding. I'm guessing it would take me anywhere from 3 - 4 weeks to get a working prototype which behaves consistenly across major browsers. With that in mind, I'll be focusing less on how to package the core functionality as a library, and try to get to a working version compatible with svelte first.
    5. Adding a whitelist for supported editing actions to further limit the scope
    6. Don't have enough time, using 3rd party lib for drag n drop
    7. Dev css styles - manual in `editor.css`
    8. Event bubbling model within root node should work better? For some input types children need to access method handlers from the parent or grand parents.

### Checklist
- [x] Routing
- [ ] Editing
    - [ ] inputText
    - [ ] inputParagraph
    - [ ] deleteContentBackward
    - [ ] Keyboard Navigation
        - [ ] Left & Right
        - [ ] Up & Down
- [ ] '/' Commands, change node type
- [x] Syncing
- [ ] Drag 'n' Drop
- [ ] Markdown
- [ ] Keyboard Shortcuts


# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
pnpm sv create

# create a new project in my-app
pnpm dlx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `pnpm install` (or `npm install` or `yarn`), start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Technical considerations

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
