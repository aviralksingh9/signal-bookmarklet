![Copy Token Demo](assets/copyTokenDemo.gif)

# Copy Token

A lightweight bookmarklet that extracts a JWT token from the current web app and copies it to your clipboard — without opening DevTools.

**Live Demo:**  
https://aviralksingh9.github.io/copy-token-bookmarklet/

![Type](https://img.shields.io/badge/Type-Bookmarklet-7C3AED?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/Zero-Dependencies-0EA5E9?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-black?style=flat-square)

---

## What It Does

Copy Token scans:

- `localStorage`
- `sessionStorage`

If it finds a valid JWT (`header.payload.signature` format), it copies it directly to your clipboard.

No network inspection.  
No manual header copying.  
No extra steps.

---

## Why It’s Useful

If you regularly:

- Open DevTools  
- Check the Network tab  
- Find Authorization headers  
- Copy Bearer tokens  
- Paste into Swagger or Postman  

This removes that repetition.

One click → token copied.

---

## Features

- Detects JWT tokens in storage
- Silent clipboard copy
- Zero dependencies (Vanilla JS)
- Optional immersive UI modes
- Works entirely in-browser

---

## Installation

1. Open `index.html` in your browser.
2. Show bookmarks bar using:

   ```
   Ctrl + Shift + B
   ```

3. Drag the **Copy Token** button to your bookmarks bar.

Installation complete.

---

## Usage

1. Log into your target environment.
2. Click the **Copy Token** bookmark.
3. The JWT token is copied silently to your clipboard.
4. Paste it wherever needed.

---

## Immersive Modes

These are optional and separate from the core utility.

### Zen Mode

- Breathing animation
- Snow effect (adjustable)
- Ambient sound
- Night visuals

### Focus Mode

- Minimal visuals
- Ambient sound
- Clean interface

Sound controls appear only inside immersive modes.

---

## Security

- No data is sent anywhere
- No tracking
- No storage of tokens
- Runs entirely in your browser
- Uses Clipboard API locally

Use only in environments you trust.

---

## How It Works

The bookmarklet:

1. Iterates over `localStorage` and `sessionStorage`
2. Checks for strings matching JWT structure
3. Copies the first valid match using the Clipboard API

No backend.  
No external requests.

---

## Project Structure

```
.
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── copyTokenDemo.gif
    ├── day.mp3
    └── zen.mp3
```

---

## Browser Support

- Chrome
- Edge
- Brave
- Firefox

Note: Audio autoplay depends on browser interaction policies.

---

## Built With

- Vanilla JavaScript
- Canvas API
- Modern CSS
- Bookmarklet architecture

No frameworks.  
No build step.

---

## 🎵 Audio Credits

Zen Mode and Focus Mode include music by **Scott Buckley**, used under the Creative Commons Attribution 4.0 License (CC BY 4.0).

- **Zen Mode:**  
  *Meanwhile* — Scott Buckley  
  https://www.scottbuckley.com.au/library/meanwhile/

- **Focus Mode:**  
  *Life in Motion* — Scott Buckley  
  https://www.scottbuckley.com.au/library/life-in-motion/

Music © Scott Buckley  
Licensed under CC BY 4.0  
https://creativecommons.org/licenses/by/4.0/

---

## License

MIT License

Copyright (c) 2026 Aviral K Singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

