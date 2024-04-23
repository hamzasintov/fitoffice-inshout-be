#!/bin/bash

# navigate to project folder
cd /home/ubuntu/fitOffice-inshout

# To stop already running project
pm2 stop fitOffice-inshout

pm2 delete fitOffice-inshout

# for project start
pm2 start --name fitOffice-inshout npm -- start