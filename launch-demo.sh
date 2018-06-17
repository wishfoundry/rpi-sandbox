#!/bin/bash
npm run build
npm run start
echo "Opening in fullscreen mode. Press Alt+F4 to close"
ready dummy
chromium-browser --disable-infobars --start-maximized --kiosk "http://localhost:8080"