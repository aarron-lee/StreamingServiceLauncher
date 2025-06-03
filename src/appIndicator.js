const { Tray, Menu } = require("electron");
const path = require("path");

let app;
let url;
let setIsHidden;
let getIsHidden;
let toolTipName;
let icon;

let initialized = false;

function initializeTray({
  application,
  appUrl,
  setHidden,
  getHidden,
  appName,
  iconPath,
}) {
  app = application;
  url = appUrl;
  setIsHidden = setHidden;
  getIsHidden = getHidden;
  icon = iconPath;
  toolTipName = appName;

  initialized = true;
}

function createTray(win) {
  if (!initialized) {
    return;
  }
  tray = new Tray(path.join(icon));

  const { contextMenu, toggleWindow } = createContextMenu(win);

  tray?.setToolTip(toolTipName);
  tray?.setContextMenu(contextMenu);

  tray?.on("click", () => {
    toggleWindow();
  });
}

function createContextMenu(win) {
  if (!initialized) {
    return;
  }
  const toggleWindow = () => {
    const windowIsVisible = win.isVisible();
    if (windowIsVisible) {
      win.hide();
      setIsHidden(url, true);
    } else {
      win.show();
      setIsHidden(url, false);
    }
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: "Toggle Window", click: toggleWindow },
    { label: "Quit", click: () => app.quit() },
  ]);

  return { contextMenu, toggleWindow };
}

module.exports = {
  initializeTray,
  createTray,
};
