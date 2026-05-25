const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    // Yeh OS ka Print Dialog kholga jahan se Print ya PDF save ho sakta hai
    ipcMain.handle('print-card', async () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.webContents.print({ silent: false, printBackground: true });
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});