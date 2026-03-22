#!/usr/bin/env bash
set -euo pipefail

export DISPLAY=:99
export SCREEN_WIDTH="${SCREEN_WIDTH:-1440}"
export SCREEN_HEIGHT="${SCREEN_HEIGHT:-900}"
export SCREEN_DEPTH="${SCREEN_DEPTH:-24}"
export VNC_PORT="${VNC_PORT:-5900}"

Xvfb :99 -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x${SCREEN_DEPTH}" -ac +extension RANDR >/tmp/xvfb.log 2>&1 &

until xdpyinfo -display :99 >/dev/null 2>&1; do
  sleep 0.2
done

openbox >/tmp/openbox.log 2>&1 &
x11vnc -display :99 -forever -shared -nopw -rfbport "${VNC_PORT}" >/tmp/x11vnc.log 2>&1 &

if [[ -n "${START_URL:-}" ]]; then
  firefox-esr --new-window "${START_URL}" >/tmp/firefox.log 2>&1 &
else
  firefox-esr about:blank >/tmp/firefox.log 2>&1 &
fi

tail -f /tmp/xvfb.log /tmp/openbox.log /tmp/x11vnc.log /tmp/firefox.log
