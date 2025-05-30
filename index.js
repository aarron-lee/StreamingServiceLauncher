const streamingServices = require("./services.json");
const {
  app,
  components,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
} = require("electron");
const path = require("path");

const getServiceName = () => {
  let extractedAppname;

  for (let i = 0; i < process.argv.length; i++) {
    let flag = process.argv[i];
    const appname = flag?.match(/--appname=([a-zA-Z0-9]+)/);
    if (appname) extractedAppname = appname[1];
  }
  const serviceName = extractedAppname || process.env?.APP_NAME || "default";

  return serviceName;
};

const createCopyMenu = () => {
  ipcMain.handle("show-context-menu", async (event, txt) => {
    const template = [
      {
        label: "Copy",
        click: () => {
          event.sender.send("context-menu-command", txt);
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(BrowserWindow.fromWebContents(event.sender));
  });
};

function createWindow() {
  let serviceName, appUrl, userAgent, zoomFactor;

  if (process.env.APP_URL) {
    // user provided manual APP_URL override, use it instead
    appUrl = process.env.APP_URL;

    // other manual overrides
    if (process.env.USER_AGENT) userAgent = process.env.USER_AGENT;
    if (process.env.ZOOM_FACTOR)
      zoomFactor = parseFloat(process.env.ZOOM_FACTOR);
  } else {
    serviceName = getServiceName();

    if (serviceName === "default") {
      createCopyMenu();
      // render index.html, since no appName was provided
      const win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        maxWidth: 1280,
        maxHeight: 720,
        fullscreen: false,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, "./preload.js"),
        },
      });

      win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
      });

      win.loadFile("./index.html");
      return;
    }

    ({ appUrl, userAgent, zoomFactor } = streamingServices[serviceName] || {});
  }

  const win = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  // pressing alt can bring up the menu bar even when its hidden. This accounts for that and disables it entirely
  win.setMenu(null);

  win.loadURL(
    appUrl,
    userAgent?.length
      ? {
          userAgent,
        }
      : {},
  );

  if (zoomFactor && zoomFactor > 0) {
    win.webContents.on("did-finish-load", () => {
      win.webContents.setZoomFactor(zoomFactor);
    });
  }
}

app.whenReady().then(async () => {
  await components.whenReady();
  console.log("components ready:", components.status());
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
