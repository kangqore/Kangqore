const { app, BrowserWindow, shell, Menu, nativeImage } = require('electron');
const path = require('path');

const isDev = process.env.ELECTRON_ENV === 'development';
const DEV_SERVER_URL = process.env.VITE_DEV_URL || 'http://localhost:3001';
const BACKEND_URL = process.env.KANGQORE_BACKEND_URL || 'http://localhost:3000';

let mainWindow;
let localServer;

function getFrontendBuildPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'frontend', 'build')
    : path.join(__dirname, '..', 'frontend', 'build');
}

async function startLocalServer() {
  const { createServer } = require('./server');
  const server = createServer(getFrontendBuildPath(), BACKEND_URL);

  return new Promise((resolve, reject) => {
    const s = server.listen(0, '127.0.0.1', () => {
      localServer = s;
      resolve(`http://127.0.0.1:${s.address().port}`);
    });
    s.on('error', reject);
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Kangqore',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#09090b',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Show window once DOM is ready to avoid white flash
  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Remove default menu bar on Windows / Linux
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  }

  let loadUrl;
  if (isDev) {
    loadUrl = DEV_SERVER_URL;
  } else {
    loadUrl = await startLocalServer();
  }

  mainWindow.loadURL(loadUrl);

  // Open external links in the system browser, not a new Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const isInternal =
      url.startsWith('http://127.0.0.1') ||
      url.startsWith('http://localhost') ||
      url.startsWith(loadUrl);

    if (!isInternal) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (localServer) localServer.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
