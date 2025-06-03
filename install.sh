#!/usr/bin/bash

if [ "$EUID" -eq 0 ]
  then echo "Please do not run as root"
  exit
fi

APP=StreamingServiceLauncher
RELEASE_URL=https://api.github.com/repos/aarron-lee/$APP/releases/latest

APPIMAGE_PATH=$HOME/Applications/$APP.AppImage
LAUNCHER_PATH=$HOME/.local/bin/streaming-service-launcher
STEAMOS_HELPER_PATH=$HOME/.local/bin/steamos-install-streaming-app
DESKTOP_ENTRY_HELPER_PATH=$HOME/.local/bin/create-streaming-app-desktop-entry
DESKTOP_ENTRY_PATH=$HOME/.local/share/applications/streamingservicelauncher.desktop

# make dirs if non-existent
mkdir -p $HOME/.local/bin
mkdir -p $HOME/Applications

# remove old versions
rm -f $APPIMAGE_PATH
rm -f $LAUNCHER_PATH
rm -f $DESKTOP_ENTRY_PATH
rm -f $STEAMOS_HELPER_PATH
rm -f $DESKTOP_ENTRY_HELPER_PATH

echo "Downloading $APP AppImage"

# curl -L $(curl -s $RELEASE_URL | grep "browser_download_url" | cut -d '"' -f 4) -o $HOME/.local/bin/$APP.AppImage
wget \
    $(curl -s $RELEASE_URL | \
    jq -r ".assets[] | select(.name | test(\".*AppImage\")) | .browser_download_url") \
    -O $APPIMAGE_PATH

cat << EOF > $LAUNCHER_PATH
#!/bin/bash
$APPIMAGE_PATH --appname=\$1 --no-sandbox
EOF

cat << EOF > $DESKTOP_ENTRY_PATH
[Desktop Entry]
Name=StreamingServiceLauncher
Exec=$APPIMAGE_PATH --no-sandbox %U
TryExec=$APPIMAGE_PATH
Terminal=false
Type=Application

StartupWMClass=StreamingServiceLauncher
Comment=Simple Launcher for streaming services
Categories=Utility;
EOF

curl -L https://raw.githubusercontent.com/aarron-lee/StreamingServiceLauncher/refs/heads/main/scripts/steamos-install-streaming-app.sh > $STEAMOS_HELPER_PATH
curl -L https://raw.githubusercontent.com/aarron-lee/StreamingServiceLauncher/refs/heads/main/scripts/create-streaming-app-desktop-entry.sh > $DESKTOP_ENTRY_HELPER_PATH

chmod +x $APPIMAGE_PATH
chmod +x $LAUNCHER_PATH
chmod +x $STEAMOS_HELPER_PATH
chmod +x $DESKTOP_ENTRY_HELPER_PATH

IMAGE_INFO="/usr/share/ublue-os/image-info.json"

if [ -f "$IMAGE_INFO" ]; then
    echo "Ublue image detected"
    # handle for SE Linux
    sudo chcon -u system_u -r object_r --type=bin_t $APPIMAGE_PATH
    sudo chcon -u system_u -r object_r --type=bin_t $LAUNCHER_PATH
    sudo chcon -u system_u -r object_r --type=bin_t $STEAMOS_HELPER_PATH
    sudo chcon -u system_u -r object_r --type=bin_t $DESKTOP_ENTRY_HELPER_PATH
fi

echo "Installation complete"
