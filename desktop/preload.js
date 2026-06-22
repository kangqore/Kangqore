const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronDesktop', {
  platform: process.platform,
});
