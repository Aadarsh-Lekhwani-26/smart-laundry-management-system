const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("laundryApp", {
  getAppInfo: () => ({
    name: "Smart Laundry Management System",
    version: "1.0.0",
  }),
});