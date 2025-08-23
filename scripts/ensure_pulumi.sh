#!/bin/bash
set -e

PULUMI_VERSION="3.113.3"
PULUMI_INSTALL_DIR="$HOME/.pulumi"
PULUMI_BIN="$PULUMI_INSTALL_DIR/bin"
PULUMI_EXEC="$PULUMI_BIN/pulumi"

# Ensure the bin directory exists
mkdir -p "$PULUMI_BIN"

# Add to PATH for the current script execution
export PATH="$PULUMI_BIN:$PATH"

# Check if Pulumi is already installed and at the correct version
if command -v pulumi &> /dev/null; then
    INSTALLED_VERSION=$(pulumi version)
    if [ "$INSTALLED_VERSION" == "v$PULUMI_VERSION" ]; then
        echo "Pulumi v$PULUMI_VERSION is already installed."
        exit 0
    else
        echo "Found Pulumi version $INSTALLED_VERSION, but require v$PULUMI_VERSION. Re-installing."
        # The installation process below will overwrite the existing files.
    fi
fi

echo "Installing Pulumi v$PULUMI_VERSION..."

# Determine architecture
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then
    ARCH="x64"
elif [ "$ARCH" == "aarch64" ]; then
    ARCH="arm64"
fi

# Determine OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')

# Construct download URL
DOWNLOAD_URL="https://get.pulumi.com/releases/sdk/pulumi-v${PULUMI_VERSION}-${OS}-${ARCH}.tar.gz"

# Download and extract
TMP_DIR=$(mktemp -d)
echo "Downloading from $DOWNLOAD_URL..."
curl -L "$DOWNLOAD_URL" -o "$TMP_DIR/pulumi.tar.gz"
tar -xzf "$TMP_DIR/pulumi.tar.gz" -C "$TMP_DIR"

# Install
# The tarball contains a `pulumi` directory, move its contents
mv "$TMP_DIR/pulumi/"* "$PULUMI_BIN/"
rm -rf "$TMP_DIR"

echo "Pulumi v$PULUMI_VERSION installed successfully to $PULUMI_BIN"
echo "Please ensure '$PULUMI_BIN' is in your PATH for future sessions."

# Final version check
INSTALLED_VERSION=$(pulumi version)
if [ "$INSTALLED_VERSION" != "v$PULUMI_VERSION" ]; then
    echo "Error: Installed version ($INSTALLED_VERSION) does not match required version (v$PULUMI_VERSION)."
    exit 1
fi

echo "Pulumi version check passed."
exit 0
