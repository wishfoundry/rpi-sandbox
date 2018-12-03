# note: install this in rasbian-lite, to avoid having any desktop

sudo apt-get update
sudo apt-get upgrade

# install bar min xserver and window manager
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox

sudo apt-get install --no-install-recommends chromium-browser

cat > /etc/xdg/openbox/autostart << EOL
# Disable any form of screen saver / screen blanking / power management
xset s off
xset s noblank
xset -dpms

# Allow quitting the X server with CTRL-ATL-Backspace
setxkbmap -option terminate:ctrl_alt_bksp

# Start Chromium in kiosk mode
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
chromium-browser --disable-infobars --kiosk 'http://your-url-here'
EOL

cat >> .bash_profile << EOL

[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
EOL