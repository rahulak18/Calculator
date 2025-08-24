# 🧮 Draggable Calculator

> The calculator you never knew you needed, but now can’t live without. It’s draggable. It’s customizable. It’s probably smarter than your boss’s spreadsheet.

---

## 🚀 Installation

### Using npm (the grown-up way):

```bash
npm install draggable-calculator
```

Then in your project:

```js
import "draggable-calculator";

// React / Vue / Angular / Svelte / Whatever
 <draggable-calculator secondary-color="#b51525" primary-color="#2c2e3a"
            animation-color="#54596B"></draggable-calculator>
```

### Using CDN (the YOLO way):

```html
<script src="https://unpkg.com/draggable-calculator/dist/calculator.iife.js"></script>
<draggable-calculator primary-color="purple" secondary-color="lime"></draggable-calculator>
```

---

## 🎨 Customization (Because Default Colors Are Boring)

You can pass attributes to make your calculator look like *you* wrote it:

* `primary-color` → Background color of the calculator.
* `secondary-color` → The glorious `=` button color.
* `animation-color` → Hover color when you can’t resist clicking buttons.
* `text-color` → Because neon green on black is always a vibe.
* `border-color` → Give it that hacker aesthetic with glowing outlines.

Example:

```html
<draggable-calculator
  primary-color="#111"
  secondary-color="orange"
  animation-color="cyan"
  text-color="yellow"
  border-color="pink">
</draggable-calculator>
```

---

## 🤹 Features

* **Drag it anywhere** → Pretend you’re a hacker dragging windows around your screen like in a movie.
* **Math inside your browser** → Because reaching for the real calculator is too much cardio.
* **Customizable themes** → Impress your teammates with a calculator that matches your dark mode.
* **Works everywhere** → Vanilla JS, React, Vue, Angular, even that one Svelte project your intern started.
* **npm + CDN** → Whether you’re a serious dev or just copy-paste gang, we’ve got you covered.

---

## ⚡ Examples

```html
<draggable-calculator primary-color="#2a2a2a" secondary-color="red"></draggable-calculator>
```

![screenshot](https://via.placeholder.com/400x400?text=Imagine+a+Cool+Calculator+Here)

---

## 🛠 Development

Want to mess with it? Clone this repo, then:

```bash
npm install
npm run build
```

Then publish your own cooler version and call it *super-draggable-calculator-3000*.

---

## 🧑‍💻 Why?

Because normal calculators don’t move. And that’s just sad.

---

## 📜 License

MIT – which basically means: steal it, remix it, but don’t blame me if your boss asks why the calculator has a pink border.

---

> Pro tip: If you’re using this calculator to avoid opening Excel, congratulations — you’re now officially a frontend engineer.
