# 🕳️ VoidCode

> A lightweight, customizable in-browser code editor — powered by **Ace** and **Monaco**.

VoidCode is a browser-based code editor system that lets you explore and compare different editor implementations using Ace and Monaco

It provides flexible implementations using both **Ace Editor** (fast and minimal) and **Monaco Editor** (feature-rich, VS Code-like), with support for modular and single-file setups.

---

## ⚡ Features

* 🔁 Two editor engines:

  * `ace/` → Fast, lightweight
  * `monaco/` → Powerful, VS Code-like experience
* 📦 Modular & single-file builds
* 🧩 Versioned architecture (`v1.x`, future-ready)
* 🌐 Pure HTML/CSS/JS — no build tools required
* 🧪 Easy to test, modify, and extend

---

## 📁 Repository Structure

```
voidcode/
│
├── ace/                # Ace Editor implementation
│   ├── versions/
│   │   └── v1.0/
│   │       ├── modular/
│   │       └── single-file/
│   ├── index.html
│   └── README.md
│
├── monaco/             # Monaco Editor implementation
│   ├── versions/
│   │   └── v1.0/
│   │       ├── modular/
│   │       └── single-file/
│   ├── index.html
│   └── README.md
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Quick Test

Open directly in your browser:

* `ace/index.html`
* `monaco/index.html`

---

### Use a Specific Version

Navigate to:

```
ace/versions/v1.0/
monaco/versions/v1.0/
```

Choose your setup:

* `modular/` → Separate HTML, CSS, JS
* `single-file/` → Everything bundled in one file

---

## 🧠 Why VoidCode?

This project is designed for:

* Devs who want a **plug-and-play editor**
* Experimenting with **editor engines**
* Understanding how editors like VS Code work internally
* Building tools like:

  * Online IDEs
  * Code playgrounds
  * Dev utilities

---

## 🧭 Philosophy

VoidCode is built on a simple idea:

* Tools should be accessible
* Learning should be frictionless
* Curiosity shouldn’t require expensive setups

This project is open for everyone — beginners, explorers, and contributors alike.

---

## 🔮 Future Plans

* More versions (`v1.x`, `v2.0`)
* Plugin system (themes, extensions)
* Engine switch with unified interface
* Improved multi-language support
* Integration with custom tools and ecosystems

---

## 📜 License

Licensed under the terms defined in the `LICENSE` file.

---

## 🤝 Contributing

Not strict yet — fork it, experiment, break things, and rebuild better.

---

## 🧩 Related

Each editor has its own detailed README:

* `ace/README.md`
* `monaco/README.md`

---

> Built for experimentation, learning, and pushing browser-based editors further.

> 🌐 **Try Live**  
> Try it here: https://akpandey-dev.github.io/voidcode