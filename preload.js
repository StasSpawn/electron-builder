// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {contextBridge, ipcRenderer} = require('electron/renderer');
const { webUtils } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
});

contextBridge.exposeInMainWorld('electronAPI', {

  openLinkInBrowser: (data) => ipcRenderer.invoke('open_link_in_browser', data),

  pickFile: (data) => ipcRenderer.invoke('pick_file', data),

  checkPython: () => ipcRenderer.invoke('check_python'),

  openFolderWithFile: (data) => ipcRenderer.invoke('open_folder_with_file', data)
});


