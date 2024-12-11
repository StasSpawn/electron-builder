// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('node:path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {shell} = require('electron');
const {autoUpdater, AppUpdater} = require("electron-updater");


const pathToResultFolder = 'D:\\Vizor\\Electron\\bank-files-converter\\acceptedFiles\\';

// run python process
const execRun = async (fileName) => {
  try {
    const {error, stdout, stderr} = await exec(`echo ${fileName}`);
    if (error) {
      if (error.code === 1) {
        return {
          result: error.code,
          status: 'error'
        }
      } else {
        return {
          result: error,
          status: 'error'
        }
      }
    } else {
      // success result
      return {
        result: pathToResultFolder + fileName,
        status: 'success'
      }
    }
  } catch (e) {
    return {
      result: e,
      status: 'error'
    }
  }
};


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    title: 'Bank files converter ' + require('./package.json').version,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  autoUpdater.checkForUpdatesAndNotify();

  // open folder with file by click
  ipcMain.handle('open_link_in_browser', async (event, link) => {
    exec('start ' + link)
  });


  ipcMain.handle('check_python', async (event) => {
    try {
      await exec('python /?');
      return true
    } catch (e) {
      return false
    }
  });

  // open folder with file by click
  ipcMain.handle('open_folder_with_file', async (event, pathToFile) => {
    shell.showItemInFolder(pathToFile);
  });

  // handle selecting file with window or drop and run process
  ipcMain.handle('pick_file', async (event, fileNameFromDrop) => {

    if (fileNameFromDrop) {
      // run process function with dropped file
      return await execRun(fileNameFromDrop)
    } else {
      const {canceled, filePaths} = await dialog.showOpenDialog();
      if (!canceled) {
        // cut path and get only file name
        let filename = filePaths[0].split("\\").pop();

        // run process function
        return await execRun(filename)

      }
    }
  });


  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
