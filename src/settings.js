const path = require("path");
const fs = require("fs");

const IS_WINDOW_HIDDEN = "isWindowHidden";

const DEFAULT_SETTINGS = {
  appVersion: undefined,
  [IS_WINDOW_HIDDEN]: {
    default: false,
  },
};

function initializeSettings(app) {
  const appVersion = app.getVersion();
  const CONFIG_PATH = app.getPath("appData");
  const SETTINGS_PATH = path.join(
    CONFIG_PATH,
    "streaming-service-launcher.json"
  );

  let settings = DEFAULT_SETTINGS;

  const saveSettings = () => {
    settings.appVersion = appVersion;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
  };

  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const rawData = fs.readFileSync(SETTINGS_PATH);

      settings = JSON.parse(rawData);
    } else {
      // initialize settings file
      saveSettings();
    }
  } catch (e) {
    console.error(e);
  }

  const setItem = (key, value) => {
    settings[key] = value;
    saveSettings();
  };

  const getItem = (key) => settings[key];

  const getSettings = () => settings;

  // save settings to disk on initialization
  saveSettings();

  const getIsHidden = (url) => {
    const isHidden = getItem(IS_WINDOW_HIDDEN);

    return isHidden[url] || false;
  };

  const setIsHidden = (url, value) => {
    const isHidden = getItem(IS_WINDOW_HIDDEN);

    isHidden[url] = value;

    setItem(IS_WINDOW_HIDDEN, isHidden);
  };

  return { getSettings, setItem, getItem, getIsHidden, setIsHidden };
}

module.exports = {
  initializeSettings,
};
