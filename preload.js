const {contextBridge, ipcRenderer} = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  pickFile: () => ipcRenderer.invoke('pick_file'),
})
