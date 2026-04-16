const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;
let currentFilePath = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
  buildMenu();
}

function buildMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: openFile,
        },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: saveFile,
        },
        {
          label: "Refresh",
          accelerator: "F5",
          click: refreshFile,
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function openFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Markdown Files", extensions: ["md", "markdown", "txt"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    currentFilePath = result.filePaths[0];
    loadFile();
  }
}

function refreshFile() {
  if (currentFilePath) {
    loadFile();
  }
}

function loadFile() {
  try {
    const content = fs.readFileSync(currentFilePath, "utf-8");
    const fileName = path.basename(currentFilePath);
    mainWindow.setTitle(`MD Viewer - ${fileName}`);
    mainWindow.webContents.send("file-loaded", content);
  } catch (err) {
    dialog.showErrorBox("Error", `Could not read file:\n${err.message}`);
  }
}

function saveFile() {
  if (!currentFilePath) return;
  mainWindow.webContents.send("request-save");
}

ipcMain.on("save-content", (_event, content) => {
  if (!currentFilePath) return;
  try {
    fs.writeFileSync(currentFilePath, content, "utf-8");
    const fileName = path.basename(currentFilePath);
    mainWindow.setTitle(`MD Viewer - ${fileName}`);
  } catch (err) {
    dialog.showErrorBox("Error", `Could not save file:\n${err.message}`);
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});
