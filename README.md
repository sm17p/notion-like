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
- Undo / Redo

### Future support to take into account for architechting present solution
- [Input Method Editors](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)
- i18n
- Collaboration - Centralized vs P2P?
- Note sharing?
    1. De-facto, login auth centralized server
    2. URL as data store | JavaScript Object -> compression (ProtoBuf or MessagePack) -> query_params - url size limits? (URLS are ASCII, 1 char -> 1 byte)
        - Google Chrome: Around 32,767 characters.   
        - Mozilla Firefox: Around 65,536 characters.   
        - Safari: Around 80,000 characters. Again, while technically supporting long URLs, keeping them concise is best practice.
        - Microsoft Edge: Similar to Chrome, around 32,767 characters. This is likely due to the shared Chromium engine.   
        - Google Android: Around 8,192 characters. 
- Spell Check, language tools web extensions? (Too far)



### How?
- Data
    1. Ropes vs gap buffers vs piece tables vs n-ary trees

- View
    - Use contententeditable="true" for the work area
        - Map data to html elements

- Controller
    - Read [Input Event Types](https://w3c.github.io/input-events/#interface-InputEvent-Attributes) spec and scope out support for event types 
    - Read [Clipboard Event](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)

- Caveats
    - 


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
