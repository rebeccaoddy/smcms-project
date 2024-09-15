#!/bin/bash

# Navigate to the caseManagementSystem directory and install dependencies
cd caseManagementSystem || exit
echo "Installing dependencies for caseManagementSystem..."
npm install

# Start the caseManagementSystem application
echo "Starting caseManagementSystem application..."
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
