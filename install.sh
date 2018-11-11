#!/bin/bash

main () {
  intro
  rotate_monitor
  improve_color
  font_antialiasing
  prevent_monitor_sleep
  install_git
  install_chromium
  install_node
  install_app
  autostart_chromium
  create_app_daemon
#   modify_cron
  show_complete
}

intro() {
  echo "================================================="
  echo $'\e[32mDaylight Kiosk Installation\e[39m'
}

rotate_monitor() {
  echo
  read -p $'\e[33mRotate the monitor? \e[2m(\e[0m0\e[2m=No, 1=90°, 2=180°, 3=270°)\e[0m \e[39m' -r REPLY

  if [ -z $REPLY ]
  then
    REPLY="N"
  fi

  if [[ ! $REPLY =~ ^[Nn]$ ]]
  then
    echo "Updating monitor config..."
    sudo bash -c "echo 'display_rotate=$REPLY' >> /boot/config.txt"
  fi
}

improve_color() {
  echo
  read -p $'\e[33mImprove color settings? \e[2m(\e[0mY\e[2m/n)\e[0m \e[39m' -r REPLY

  if [[ ! $REPLY =~ ^[Nn]$ ]]
  then
    echo "Modifying color configuration..."
    sudo bash -c "echo 'framebuffer_depth=32' >> /boot/config.txt"
    sudo bash -c "echo 'framebuffer_ignore_alpha=1' >> /boot/config.txt"
  fi
}

font_antialiasing() {
  echo
  read -p $'\e[33mTurn on font antialiasing? \e[2m(\e[0mY\e[2m/n)\e[0m \e[39m' -r REPLY

  if [[ ! $REPLY =~ ^[Nn]$ ]]
  then
    echo "Copying antialias files..."
    mkdir ~/.config/fontconfig
    cp ./src/fonts.xml ~/.config/fontconfig/.fonts.conf
  fi
}

prevent_monitor_sleep() {
  echo
  read -p $'\e[33mPrevent monitor from sleeping? \e[2m(\e[0mY\e[2m/n)\e[0m \e[39m' -r REPLY

  if [[ ! $REPLY =~ ^[Nn]$ ]]
  then
    echo "Modifying files..."
    touch ~/.xinitrc
    echo "@xset s noblank" >> ~/.xinitrc
    echo "@xset s off" >> ~/.xinitrc
    echo "@xset -dpms" >> ~/.xinitrc
    echo "@xset s 0 0" >> ~/.config/lxsession/LXDE-pi/autostart
    echo "@xset s noblank" >> ~/.config/lxsession/LXDE-pi/autostart
    echo "@xset s noexpose" >> ~/.config/lxsession/LXDE-pi/autostart
    echo "@xset dpms 0 0 0" >> ~/.config/lxsession/LXDE-pi/autostart

    
    sudo sed -i 's/@xscreensaver/#@xscreensaver/' /etc/xdg/lxsession/LXDE/autostart
    sudo bash -c "echo 'xserver-command=X -s 0 dpms' >> /etc/lightdm/lightdm.conf"
  fi
}

install_chromium() {
  echo
  echo "Installing chromium..."
  sudo apt-get update
  wget -qO - http://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
  echo "deb http://dl.bintray.com/kusti8/chromium-rpi jessie main" | sudo tee -a /etc/apt/sources.list
  sudo apt-get install chromium-browser x11-xserver-utils unclutter
}

autostart_chromium() {
  echo
  echo "Setting Chromium to autostart..."
  STARTUP_URL="http://localhost:8080"

  echo "@chromium-browser --kiosk --start-maximized --incognito --disable-infobars $STARTUP_URL" >> ~/.config/lxsession/LXDE-pi/autostart
#   echo "@unclutter -idle 0.1 -root" >> ~/.config/lxsession/LXDE-pi/autostart
}

install_node() {
    echo
    read -p 'install nodejs?' -r REPLY
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo "Installing latest node"
        sudo apt install -y nodejs
        node -v
        which node
    else
        echo "not installing node"
    fi
}

install_app() {
    echo "downloading app"

    cd /home/pi
    git clone https://github.com/wishfoundry/rpi-sandbox app

}

create_app_daemon() {
    sudo touch /etc/systemd/system/gpio_app.service
    sudo cat > /etc/systemd/system/gpio_app.service << EOL
[Unit]
Description=GPIO_APP
After=network.target

[Service]
ExecStart=/usr/bin/node /home/pi/app/src/server/index.js
WorkingDirectory=/home/pi/app
Restart=on-failure
User=root
# Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

    sudo systemctl daemon-reload
    sudo systemctl enable gpio_app
    sudo systemctl start gpio_app
}

install_git() {
    sudo apt-get install git
}

modify_cron() {
  echo
  echo "Modifying power schedule... (on at 6am, off at 11am)"

  sudo crontab -l > root-cron
  echo "0 6 * * * /usr/local/sbin/screen on 2> /usr/local/sbin/screen.err.log" >> root-cron
  echo "0 11 * * * /usr/local/sbin/screen off 2> /usr/local/sbin/screen.err.log" >> root-cron
  echo "" >> root-cron
  sudo crontab root-cron
  rm root-cron
  sudo service cron restart
  sudo update-rc.d cron defaults
}

show_complete() {
#   echo $'\n\n\e[32mAll done! You can restart your PI by typing "sudo reboot -h now"\e[39m\n\n'
    echo
read -p $'\e[33mAll Don! Do you want to reboot? \e[2m(\e[0mY\e[2m/n)\e[0m \e[39m' -r REPLY

    if [[ ! $REPLY =~ ^[Nn]$ ]]
        then
        sudo reboot -h now
    fi
}

main