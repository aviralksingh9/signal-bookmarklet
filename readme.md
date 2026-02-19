![Copy Token Demo](assets/copyTokenDemo.gif)

# Copy Token

**Eliminate DevTools friction.**  
One click. Instant token.

![Type](https://img.shields.io/badge/Type-Bookmarklet-7C3AED?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/Zero-Dependencies-0EA5E9?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-black?style=flat-square)

---

## Overview

Copy Token is a premium bookmarklet utility that instantly extracts JWT tokens from any logged-in web application — without opening DevTools.

No Network tab hunting.  
No Storage inspection.  
No manual copying of Authorization headers.  

Just one click.

---

## Why This Exists

Developers frequently:

- Open DevTools
- Inspect network requests
- Locate Authorization headers
- Copy Bearer tokens
- Paste into Swagger or Postman

This workflow is repetitive and inefficient.

Copy Token eliminates that friction entirely.

---

## Features

- Detects JWT tokens in localStorage and sessionStorage
- Silent clipboard copy (no intrusive alerts)
- Zen Mode with immersive breathing animation
- Focus Mode for minimal distraction
- Animated sunrise → sunset → night sky cycle
- Aurora shimmer and shooting stars
- Snow intensity control (Zen mode only)
- Optional ambient soundscape (Zen and Focus only)
- Premium glass aesthetic UI
- Zero dependencies (Vanilla JavaScript)

---

## Installation

1. Open `index.html` in your browser.
2. Show your bookmarks bar using:

   Ctrl + Shift + B

3. Drag the **Copy Token** button to your bookmarks bar.

Installation complete.

---

## Usage

1. Log into any web environment.
2. Click your **Copy Token** bookmark.
3. The JWT token is copied silently to your clipboard.

Paste it wherever needed.

---

## Immersive Modes

### Zen Mode

- Breathing animation
- Snowfall with adjustable intensity
- Calm ambient soundtrack
- Night aurora visuals

### Focus Mode

- Minimal visual environment
- Deep ambient soundscape
- Clean distraction-free interface

Sound controls appear only inside immersive modes.  
The landing page remains utility-focused.

---

## Security and Privacy

This tool:

- Does not send data anywhere
- Does not store tokens
- Does not log user activity
- Executes entirely in your browser
- Copies tokens locally using the Clipboard API

Always ensure you trust the environment where you use this bookmarklet.

---

## How It Works

The bookmarklet scans:

- localStorage
- sessionStorage

It identifies strings matching JWT structure:

header.payload.signature

The first valid match is copied directly to the clipboard.

No network calls.  
No external APIs.  
No tracking.

---

## Project Structure
.
├── index.html
├── styles.css
├── script.js
└── assets
    ├── copyTokenDemo.gif
    ├── day.mp3
    ├── zen.mp3

---

## Browser Support

- Chrome
- Edge
- Brave
- Firefox

Note: Audio autoplay follows browser security policies and requires user interaction.

---

## Built With

- Vanilla JavaScript
- Canvas API
- Modern CSS
- Bookmarklet architecture

No frameworks.  
No build tools.  
No dependencies.

---

## License

MIT License

---

## Philosophy

Developer tools should reduce friction.

Copy Token combines precision utility, elegant design, minimalism, and immersive craftsmanship — because even small workflows deserve thoughtful execution.

Built for developers who value clarity and calm.
