# GIEx1
A new, unique (never done previously) injection method into Discord's desktop app.

## Method
GIEx1 relies on Discord's new updater API (referred to as v2 in this document). v2 uses a native Rust library which the client (code within `app.asar`) `require`'s. By replacing this, you can get code execution within the `app.asar`. What this project does:
 - Make a directory with the original name (`updater`)
 - Move the original native library within (`updater.node` moves into the `updater` dir)
 - Make an `index.js` file with our custom code, which:
   - Makes a class extending the native library's
   - Hooks into functions to:
     - Forcing update endpoint to have mods (GooseMod as an example) injected
     - Rehook GIEx1 into any new updates