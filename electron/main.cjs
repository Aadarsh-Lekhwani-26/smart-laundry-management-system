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
  ipcMain.handle("orders:load", async () => {
    return loadOrders();
  });

  ipcMain.handle("orders:save", async (_event, orders) => {
    return saveOrders(orders);
  });

  ipcMain.handle("pricing:load", async () => {
    return loadPricing();
  });

  ipcMain.handle("pricing:save", async (_event, pricing) => {
    return savePricing(pricing);
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#f3f6f5",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    window.loadURL("http://127.0.0.1:5173");
  }
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
