const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");

function getOrdersFilePath() {
  return path.join(app.getPath("userData"), "orders.json");
}

function getPricingFilePath() {
  return path.join(app.getPath("userData"), "pricing.json");
}

const DEFAULT_PRICING = {
  washing: 30,
  ironing: 15,
};

async function loadPricing() {
  const filePath = getPricingFilePath();

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const pricing = JSON.parse(fileContents);

    if (
      !pricing ||
      !Number.isFinite(pricing.washing) ||
      !Number.isFinite(pricing.ironing) ||
      pricing.washing < 0 ||
      pricing.ironing < 0
    ) {
      throw new Error("Stored pricing data is invalid.");
    }

    return pricing;
  } catch (error) {
    if (error.code === "ENOENT") {
      return { ...DEFAULT_PRICING };
    }

    throw error;
  }
}

async function savePricing(pricing) {
  if (
    !pricing ||
    !Number.isFinite(pricing.washing) ||
    !Number.isFinite(pricing.ironing) ||
    pricing.washing < 0 ||
    pricing.ironing < 0
  ) {
    throw new Error("Invalid pricing values.");
  }

  const filePath = getPricingFilePath();
  const temporaryFilePath = `${filePath}.tmp`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(
    temporaryFilePath,
    JSON.stringify(pricing, null, 2),
    "utf8"
  );

  await fs.rename(temporaryFilePath, filePath);

  return { success: true };
}

async function loadOrders() {
  const filePath = getOrdersFilePath();

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const orders = JSON.parse(fileContents);

    if (!Array.isArray(orders)) {
      throw new Error("Stored orders data must be an array.");
    }

    return orders;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function saveOrders(orders) {
  if (!Array.isArray(orders)) {
    throw new Error("Orders must be provided as an array.");
  }

  const filePath = getOrdersFilePath();
  const temporaryFilePath = `${filePath}.tmp`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(
    temporaryFilePath,
    JSON.stringify(orders, null, 2),
    "utf8"
  );

  await fs.rename(temporaryFilePath, filePath);

  return { success: true };
}

function registerStorageHandlers() {
  ipcMain.handle("orders:load", async () => loadOrders());

  ipcMain.handle("orders:save", async (_event, orders) => {
    return saveOrders(orders);
  });

  ipcMain.handle("pricing:load", async () => loadPricing());

  ipcMain.handle("pricing:save", async (_event, pricing) => {
    return savePricing(pricing);
  });
}

let mainWindow = null;

function createWindow() {
  const isPackaged = app.isPackaged;

  // app.getAppPath() resolves to the application root,
  // including Resources/app.asar in a packaged macOS app.
  const appPath = app.getAppPath();

  const preloadPath = path.join(
    appPath,
    "electron",
    "preload.cjs"
  );

  const productionHtmlPath = path.join(
    appPath,
    "dist",
    "index.html"
  );

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#f3f6f5",
    show: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL) => {
      console.error("Failed to load application:", {
        errorCode,
        errorDescription,
        validatedURL,
      });
    }
  );

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("Renderer process exited:", details);
  });

  mainWindow.webContents.on("preload-error", (_event, preloadPath, error) => {
    console.error("Preload script failed:", preloadPath, error);
  });

  mainWindow.webContents.on("console-message", (_event, details) => {
    if (details.level >= 2) {
      console.error("Renderer console error:", details.message);
    }
  });

  if (isPackaged) {
    console.log("Packaged application path:", appPath);
    console.log("Loading production HTML:", productionHtmlPath);

    mainWindow.loadFile(productionHtmlPath).catch((error) => {
      console.error("Could not load production HTML:", error);
      mainWindow?.show();
    });
  } else {
    mainWindow.loadURL("http://127.0.0.1:5173").catch((error) => {
      console.error("Could not load Vite development server:", error);
      mainWindow?.show();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerStorageHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});