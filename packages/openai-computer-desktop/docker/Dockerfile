FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  dbus-x11 \
  firefox-esr \
  imagemagick \
  openbox \
  procps \
  python3 \
  x11-utils \
  x11vnc \
  xdotool \
  xvfb \
  && rm -rf /var/lib/apt/lists/*

COPY start-desktop.sh /usr/local/bin/start-desktop.sh
RUN chmod +x /usr/local/bin/start-desktop.sh

EXPOSE 5900

CMD ["/usr/local/bin/start-desktop.sh"]
