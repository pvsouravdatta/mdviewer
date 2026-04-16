marked.setOptions({
  breaks: true,
  gfm: true,
});

let rawMarkdown = "";
let editMode = false;

const content = document.getElementById("content");
const editor = document.getElementById("editor");
const toggleBtn = document.getElementById("toggle-btn");

function renderView() {
  content.innerHTML = marked.parse(rawMarkdown);
  content.style.display = "block";
  editor.style.display = "none";
  toggleBtn.textContent = "Edit";
  editMode = false;
}

function enterEdit() {
  editor.value = rawMarkdown;
  content.style.display = "none";
  editor.style.display = "block";
  editor.focus();
  toggleBtn.textContent = "View";
  editMode = true;
}

const themeBtn = document.getElementById("theme-btn");

themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeBtn.textContent = isDark ? "Light" : "Dark";
});

toggleBtn.addEventListener("click", () => {
  if (editMode) {
    rawMarkdown = editor.value;
    renderView();
  } else {
    enterEdit();
  }
});

window.mdviewer.onFileLoaded((markdown) => {
  rawMarkdown = markdown;
  toggleBtn.disabled = false;
  renderView();
});

window.mdviewer.onRequestSave(() => {
  if (editMode) {
    rawMarkdown = editor.value;
  }
  window.mdviewer.saveContent(rawMarkdown);
});
