# StreamingServiceLauncher

[![](https://img.shields.io/github/downloads/aarron-lee/StreamingServiceLauncher/total.svg)](https://github.com/aarron-lee/StreamingServiceLauncher/releases)

Simple Launcher for Video Streaming Services on SteamOS, Bazzite, SteamFork, etc

![app image](./img/app.png)

# Installation / Update

run the following script, it does both install and updates:

```
curl -L https://raw.githubusercontent.com/aarron-lee/StreamingServiceLauncher/refs/heads/main/install.sh | sh
```

# Uninstall

```bash
rm $HOME/Applications/StreamingServiceLauncher.AppImage
rm $HOME/Applications/streaming_scripts/*.sh
rm $HOME/.local/bin/streaming-service-launcher
rm $HOME/.local/bin/steamos-install-streaming-app
rm $HOME/.local/share/applications/streamingservicelauncher*.desktop
rm $HOME/.local/bin/create-streaming-app-desktop-entry
```

# Usage

```bash
$HOME/.local/bin/streaming-service-launcher serviceName
```

Example:

```bash
# example for netflix
$HOME/.local/bin/streaming-service-launcher netflix
```

You can find all `serviceName` values in the [services.json](./services.json)

## Create Desktop Entries

```bash
$HOME/.local/bin/create-streaming-app-desktop-entry serviceName
```

Example for netflix:

```bash
# creates desktop entry
$HOME/.local/bin/create-streaming-app-desktop-entry netflix

# This will generate a desktop app entry in the following location:
$HOME/.local/share/applications/streamingservicelauncher-netflix.desktop
```

Delete the generated desktop entry file if you wish to remove it.

## Add to Steam Deck Gaming mode

Note, your distro must support the `steamos-add-to-steam` command

```bash
# adds streaming service to Steam Gaming mode
$HOME/.local/bin/steamos-install-streaming-app serviceName

# example: netflix
$HOME/.local/bin/steamos-install-streaming-app netflix
```

Make sure to reboot steam after adding a streaming app. You can find all `serviceName` values in the [services.json](./services.json)

## Custom Targets

You can also set custom targets, see below for usage:

```bash
APP_URL=https://example.com  $HOME/.local/bin/streaming-service-launcher

# Optional: USER_AGENT and ZOOM_FACTOR can additionally be added, but requires the APP_URL env var
# ZOOM_FACTOR must be an integer or float
APP_URL=https://example.com  USER_AGENT="UserAgent Here"  ZOOM_FACTOR="1.5"  $HOME/.local/bin/streaming-service-launcher

# Other Optional env vars:
USE_FULL_SCREEN = 0
DISABLE_MENU_BAR = 0
```

# Attribution

Icon: https://www.flaticon.com/free-icons/tv Tv icons created by Freepik - Flaticon
