#!/bin/bash
echo "starting git pull"
git reset --hard
git pull -r
echo "Done. press [Enter] key to close"
read dummy