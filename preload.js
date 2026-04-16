const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mdviewer", {
  onFileLoaded: (callback) => {
    ipcRenderer.on("file-loaded", (_event, content) => callback(content));
  },
  onRequestSave: (callback) => {
    ipcRenderer.on("request-save", () => callback());
  },
  saveContent: (content) => {
    ipcRenderer.send("save-content", content);
  },
});
