'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');

import { login, getUser, saveUser, hapusUser } from "./models/userModel.js";
import { getBarang, saveBarang, searchBarang } from "./models/barangModel.js";
import { getSatuan, saveSatuan, hapusSatuan } from "./models/satuanModel.js";
import { getTransaksi, hapusTransaksi, saveTransaksi, getHutang, saveHutang } from "./models/transaksiModel.js";
import { getPengeluaran, hapusPengeluaran, savePengeluaran } from "./models/pengeluaranModel.js";

let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.resolve(__static, 'preload.js'),
    },
    autoHideMenuBar: true,
  })

  win.maximize();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools() // buka dev tools di development mode
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on("toMain", (event, args) => {
  switch(args.func) {
    case 'login':
      login(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'getBarang':
      getBarang(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'saveBarang':
      saveBarang(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'searchBarang':
      searchBarang(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'getSatuan':
      getSatuan(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'getTransaksi':
      getTransaksi(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'hapusTransaksi':
      hapusTransaksi(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'saveTransaksi':
      saveTransaksi(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'getUser':
      getUser(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'saveUser':
      saveUser(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'hapusUser':
      hapusUser(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'saveSatuan':
      saveSatuan(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'hapusSatuan':
      hapusSatuan(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'getPengeluaran':
      getPengeluaran(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'savePengeluaran':
      savePengeluaran(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'getHutang':
      getHutang(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    case 'saveHutang':
      saveHutang(args, (err, results) => {
          if (err){
            win.webContents.send("fromMain", err)
          }else{
            win.webContents.send("fromMain", results)
          }
      });
      break;
    default:
      // code block
  }
});

// const unhandled = require('electron-unhandled');
// unhandled({
//     showDialog: true,
// });
// unhandled.logError(new Error('Test'), {title: 'Custom Title'});
