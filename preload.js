// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {contextBridge, ipcRenderer} = require('electron/renderer');
const {webUtils} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
});

contextBridge.exposeInMainWorld(
  // Allowed 'ipcRenderer' methods
  'bridge', {
    // From main to render
    sendSettings: (message) => {
      ipcRenderer.on('sendSettings', message);
    }
  }
);

contextBridge.exposeInMainWorld('electronAPI', {



});


