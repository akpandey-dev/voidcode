

// --- Disable mobile pull-down refresh ---
let touchstartY = 0;
window.addEventListener('touchstart', e => {
  touchstartY = e.touches[0].clientY;
});
window.addEventListener('touchmove', e => {
  const touchY = e.touches[0].clientY;
  if (touchY - touchstartY > 100 && window.scrollY === 0) {
    e.preventDefault(); // stop pull-down
  }
}, { passive: false });

/* ---------- Monaco Boot ---------- */
require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } });
require(["vs/editor/editor.main"], function () {
  window.editor = monaco.editor.create(document.querySelector('.editor'), {
    value: "<!-- Start coding here -->\n",
    language: "html",
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: true },

    renderWhitespace: "none",
    scrollBeyondLastLine: false,
    overviewRulerLanes: 0,
 
  });



  editor.updateOptions({
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  wordBasedSuggestions: true,
   lineDecorationsWidth: 0,     // reduces extra container padding
  lineNumbersMinChars: 3,      // compact line numbers
  scrollbar: {
    horizontal: "visible",
    vertical: "visible",
    alwaysConsumeMouseWheel: true
  }
});








const langMap = {
  "web": "html",
  "js": "javascript",
  "ts": "typescript",
  "css": "css",
  "python": "python",
  "java": "java",
  "clang": "c",
  "cpplang": "cpp",
  "go": "go",
  "rust": "rust",
  "kotlin": "kotlin",
  "php": "php",
  "ruby": "ruby",
  "swift": "swift",
  "sql": "sql"
};


document.getElementById("lang-selector").addEventListener("change", e => {
  const lang = e.target.value;
  monaco.editor.setModelLanguage(editor.getModel(), langMap[lang] || "plaintext");
});






  const fileNameBox = document.querySelector('.fileName');
  const filePicker = document.getElementById('filePicker');

  /* ---------- File Ops ---------- */



  const buttons = document.querySelectorAll('.toolbar-btn');
  const menus = document.querySelectorAll('.popup-menu');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const menuId = btn.getAttribute('data-menu');
      const menu = document.getElementById(menuId);

      // Hide all menus first
      menus.forEach(m => m.style.display = 'none');

      // Position menu
      const rect = btn.getBoundingClientRect();
      let top = rect.bottom;
      let left = rect.left;

      // Show temporarily to measure size
      menu.style.display = 'block';
      menu.style.top = '0px';
      menu.style.left = '0px';

      const menuRect = menu.getBoundingClientRect();

      // Adjust horizontally if overflowing
      if (left + menuRect.width > window.innerWidth) {
        left = window.innerWidth - menuRect.width - 5;
      }
      if (left < 0) left = 5;

      // Adjust vertically if overflowing
      if (top + menuRect.height > window.innerHeight) {
        top = rect.top - menuRect.height; // show above button
      }
      if (top < 0) top = 5;

      // Final apply (works with position: fixed)
      menu.style.top = top + 'px';
      menu.style.left = left + 'px';

      e.stopPropagation();
    });
  });

  // Hide menu when clicking outside
  document.addEventListener('click', () => {
    menus.forEach(m => m.style.display = 'none');
  });






  function newFile() {
    editor.setValue("");
    fileNameBox.textContent = "untitled.html";
  }
  function openFile() { filePicker.click(); }
  filePicker.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    editor.setValue(text);
    fileNameBox.textContent = file.name;
  });
  function saveFile() {
    const text = editor.getValue();
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileNameBox.textContent || "untitled.txt";
    a.click();
  }
  function runHtml() {
    const code = editor.getValue();
    const win = window.open("", "_blank");
    win.document.write(code);
    win.document.close();
  }


  function handleCopy() {
  const text = editor.getModel().getValueInRange(editor.getSelection());
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => copyFallback(text));
  } else {
    copyFallback(text);
  }
}

function handleCut() {
  const selection = editor.getSelection();
  const text = editor.getModel().getValueInRange(selection);
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => removeSelection(selection))
      .catch(() => {
        copyFallback(text);
        removeSelection(selection);
      });
  } else {
    copyFallback(text);
    removeSelection(selection);
  }
}

function handlePaste() {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.readText()
      .then(text => {
        if (text) insertText(text);
      })
      .catch(() => pasteFallback());
  } else {
    pasteFallback();
  }
}

function removeSelection(selection) {
  editor.executeEdits(null, [{
    range: selection,
    text: "",
    forceMoveMarkers: true
  }]);
}

function insertText(text) {
  const selection = editor.getSelection();
  editor.executeEdits(null, [{
    range: selection,
    text,
    forceMoveMarkers: true
  }]);
}

// --- FALLBACKS ---

function copyFallback(text) {
  const temp = document.createElement("textarea");
  temp.style.position = "fixed";
  temp.style.opacity = 0;
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}

function pasteFallback() {
  const temp = document.createElement("textarea");
  temp.style.position = "fixed";
  temp.style.opacity = 0;
  document.body.appendChild(temp);
  temp.focus();

  // Let the user press Ctrl+V manually — secure gesture
  alert("Press Ctrl+V to paste, then press Enter.");

  temp.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const text = temp.value;
      document.body.removeChild(temp);
      if (text) insertText(text);
    }
  });
}


let iframeVisible = false;

function runInIframe() {
  const code = editor.getValue();
  const iframe = document.querySelector(".Iframe");
  const editorDiv = document.querySelector(".editor"); // div container, not Monaco object

  if (!iframeVisible) {
    editorDiv.style.display = "none";
    iframe.style.display = "block";

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();

    iframeVisible = true;
  } else {
    iframe.style.display = "none";
    editorDiv.style.display = "flex"; // restore editor
    iframeVisible = false;
  }
}

function showMonacoShortcuts() {
    const shortcuts = [
        { command: "Undo", key: "Ctrl+Z" },
        { command: "Redo", key: "Ctrl+Y" },
        { command: "Copy", key: "Ctrl+C" },
        { command: "Cut", key: "Ctrl+X" },
        { command: "Paste", key: "Ctrl+V" },
        { command: "Find", key: "Ctrl+F" },
        { command: "Replace", key: "Ctrl+H" },
        { command: "Go To Line", key: "Ctrl+G" },
        { command: "Word Wrap", key: "Alt+Z" },
        { command: "Toggle Fullscreen", key: "F11" },
        { command: "Run HTML", key: "Alt+R" } // if you want
    ];

    let html = `
        <html>
        <head>
            <title>Monaco Keyboard Shortcuts</title>
            <style>
                body { font-family: Arial, sans-serif; background: #1e1e1e; color: #fff; padding: 20px; }
                h2 { color: #00ff00; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { padding: 8px; border: 1px solid #444; text-align: left; }
                th { background: #333; }
                tr:hover { background: #094771; }
            </style>
        </head>
        <body>
            <h2>VoidCode Keyboard Shortcuts</h2>
            <table>
                <tr><th>Command</th><th>Keybinding</th></tr>`;

    shortcuts.forEach(s => {
        html += `<tr><td>${s.command}</td><td>${s.key}</td></tr>`;
    });

    html += `</table></body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
}





  /* ---------- Menu Binding ---------- */
  document.querySelectorAll("#fileMenu li").forEach(li => {
    li.addEventListener("click", () => {
      if (li.textContent === "New File") newFile();
      if (li.textContent === "Open Project") openFile();
      if (li.textContent === "Save") saveFile();
      if (li.textContent === "Exit") window.close();
  
    });
  });
  document.querySelectorAll("#editMenu li").forEach(li => {
    li.addEventListener("click", () => {
      if (li.textContent === "Undo") editor.trigger("a","undo");
      if (li.textContent === "Redo") editor.trigger("a","redo");
      if (li.textContent === "Copy") handleCopy();
      if (li.textContent === "Cut") handleCut();
      if (li.textContent === "Paste") handlePaste();
      if (li.textContent === "Clear") editor.setValue("");
      if (li.textContent === "Find") editor.getAction('actions.find').run();
      if (li.textContent === "Replace")  {
                              editor.focus();                      // make sure editor is active
                              editor.getAction('editor.action.startFindReplaceAction').run(); // correct internal replace command
                              }
    });
  });
  document.querySelectorAll("#viewMenu li").forEach(li => {
    li.addEventListener("click", () => {
      if (li.textContent === "Word wrap") {
        let cur = editor.getRawOptions().wordWrap;
        editor.updateOptions({ wordWrap: cur === "on" ? "off" : "on" });
      }
      if (li.textContent === "Font Size") {
        let s = parseInt(prompt("Enter font size:", 14));
        if (s) editor.updateOptions({ fontSize: s });
      }
      if (li.textContent === "Fullscreen") document.body.requestFullscreen();
      if (li.textContent === "Theme") {
        const t = editor._themeService._theme.themeName === "vs-dark" ? "vs-light" : "vs-dark";
        monaco.editor.setTheme(t);
      }
     if (li.textContent === "Go To Line") {
  const line = parseInt(prompt("Enter line number:", 1));
  if (line && line > 0) {
    editor.revealLineInCenter(line); // scroll to line
    editor.setPosition({ lineNumber: line, column: 1 }); // move cursor
    editor.focus();
  }
}

      if (li.textContent === "Run Html") runHtml();
      if (li.textContent === "Run In Iframe") runInIframe();

    });
  });

 document.querySelectorAll("#moreMenu li").forEach(li => {
    li.addEventListener("click", () => {
    if (li.textContent === "Command Palette") {
        if (editor && editor.trigger) {
    editor.focus(); // make sure it's active
    editor.trigger('keyboard', 'editor.action.quickCommand', null);
  } else {
    console.warn("Monaco editor not initialized yet.");
  }
    };
    if (li.textContent === "Settings") {
        alert("Currently Unavailable...")
      } 
   if (li.textContent === "Reload IDE") {
         location.reload();
      } 
   
    });
  });



 document.querySelectorAll("#helpMenu li").forEach(li => {
    li.addEventListener("click", () => {
    if (li.textContent === "Keyboard Shortcuts") showMonacoShortcuts(); 
    if (li.textContent === "Documentation") {
        const win = window.open("https://microsoft.github.io/monaco-editor/", "_blank");
        win.focus();
      } 
   
    });
  });

   document.querySelectorAll("#aboutMenu li").forEach(li => {
    li.addEventListener("click", () => {
    if (li.textContent === "About VoidCode") {
        alert("VoidCode IDE\nA lightweight web-based code editor using Monaco Editor.\n\nAce Distribution\n(c) 2024 VoidCode");
      }
    if (li.textContent === "Version 1.0") {
        alert("VoidCode IDE\nVersion 1.0\n\nReleased June 2024.\nNext updates coming soon!");
      } 
    });
  });


  /* ---------- Shortcuts ---------- */
  window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "s") { e.preventDefault(); saveFile(); }
    if (e.ctrlKey && e.key === "o") { e.preventDefault(); openFile(); }
    if (e.key === "F11") { e.preventDefault(); document.body.requestFullscreen(); }
    if (e.ctrlKey && e.key === "f") { e.preventDefault(); editor.getAction('actions.find').run(); }
    if (e.ctrlKey && e.key === "n") { e.preventDefault(); newFile(); }
  });

  
});