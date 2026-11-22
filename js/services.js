document.addEventListener("DOMContentLoaded", () => {
  const streamingServiceNames = document.getElementById(
    "streamingServiceNames",
  );

  fetch("services.json")
    .then((response) => response.json())
    .then((json) => {
      // initialize appInfo with first entry
      updateAppInfo(Object.entries(json)[0]);

      Object.entries(json).forEach(([serviceName, info]) => {
        const streamingService = document.createElement("button");

        streamingService.innerHTML = serviceName;
        streamingService.setAttribute(
          "style",
          `
          text-transform: capitalize;
          padding: 1rem;
          border: 1px solid black;
        `,
        );

        streamingService.addEventListener("click", () => {
          updateAppInfo([serviceName, info]);
        });

        streamingServiceNames.appendChild(streamingService);
      });
    });
});

function updateAppInfo([serviceName, info]) {
  const el = document.getElementById("serviceInstallInfo");
  el.setAttribute("style", `padding-left: 1rem;`);
  if (info.recommendStandaloneApp) {
    el.innerHTML = `
      <h2 style="text-transform: capitalize;">${serviceName}</h2>

      <p>For this app, it is recommended to use an already existing Standalone App.</p>
      ${info.unofficialApp && "<p>Disclaimer: this is an unofficial 3rd party app for this service"}
      <p>See the following link: <a rel="noreferrer" target="_blank" href="${info.appUrl}">${info.appUrl}</a></p>
      `;
  } else {
    el.innerHTML = generateAppInstallInstructions(serviceName, info);
  }
}

function generateAppInstallInstructions(serviceName, appInfo) {
  return `
    <h2 style="text-transform: capitalize;">${serviceName}</h2>

    <p>App url: ${appInfo.appUrl}</p>

    <h2>Basic Usage</h2>

    <p>Run the following in terminal</p>

    <pre>$HOME/.local/bin/streaming-service-launcher ${serviceName}</pre>

    <h2>Add Application to Desktop</h2>

    <p>If you would like to generate a shortcut that is accessible via your Desktop, run the following in terminal:</p>

    <pre>$HOME/.local/bin/create-streaming-app-desktop-entry ${serviceName}</pre>

    <p>This will generate a desktop app entry in the following location:</p>

    <pre>$HOME/.local/share/applications/streamingservicelauncher-${serviceName}.desktop</pre>

    <p>Delete this file if you wish to remove the app shortcut</p>

    <h2>Add to Steam Deck Gaming mode</h2>

    <p>Note, your distro must support the "steamos-add-to-steam" command</p>

    <p>Run the following in Terminal:</p>

    <pre>$HOME/.local/bin/steamos-install-streaming-app ${serviceName}</pre>
  `;
}

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  electronUtils.showContextMenu(window.getSelection().toString());
});

window.electronUtils.receive("context-menu-command", (data) => {
  navigator.clipboard.writeText(data);
});
