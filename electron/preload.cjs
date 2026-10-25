const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("laundryApp", {
  getAppInfo: () => ({
    name: "Smart Laundry Management System",
    version: "1.0.0",
  }),

  loadOrders: () => ipcRenderer.invoke("orders:load"),

  saveOrders: (orders) => ipcRenderer.invoke("orders:save", orders),

  loadPricing: () => ipcRenderer.invoke("pricing:load"),

  savePricing: (pricing) => ipcRenderer.invoke("pricing:save", pricing),
});
