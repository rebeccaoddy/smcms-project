#!/bin/bash

# Navigate to the origin directory and install dependencies
cd origin || exit
echo "Installing dependencies for origin..."
npm install

# Start the origin application
echo "Starting origin application..."
npm start &

# Navigate to the StudentMonitoringSystem directory and install dependencies
cd ../StudentMonitoringSystem || exit
echo "Installing dependencies for StudentMonitoringSystem..."
npm install

# Start the StudentMonitoringSystem application
echo "Starting StudentMonitoringSystem application..."
npm start &

# Return to the original directory
cd ..
