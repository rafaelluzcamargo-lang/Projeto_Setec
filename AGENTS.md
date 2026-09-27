# Project Guide

## Overview

Pixel Speed Run is a browser-based 2D parkour game built with plain HTML, CSS, and JavaScript. The interface and player-facing text are in Brazilian Portuguese. There is no package manager, build step, or external framework configured.

## Project Files

- `index.html` defines the game screens and canvas.
- `style.css` contains the visual styling and responsive layout.
- `Script.js` contains screen interactions, game state, input handling, and canvas gameplay.

Keep changes consistent with the existing vanilla browser implementation. Avoid adding dependencies or a build system unless the task calls for them. Preserve existing save data compatibility: game progress and accessibility preferences are stored in `localStorage`.

## Running and Checking

Open `index.html` in a modern browser to run the game. If serving the project from a case-sensitive environment, ensure the script filename in `index.html` matches `Script.js` exactly; its current reference uses lowercase `script.js`.

There is no configured test suite. If Node.js is available, check JavaScript syntax with:

```sh
node --check Script.js
```