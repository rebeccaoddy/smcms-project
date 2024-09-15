#!/bin/bash

# Navigate to the origin directory and install dependencies
cd origin || exit
echo "Installing dependencies for origin..."
npm install

# Start the origin application
echo "Starting origin application..."
npm start &

# Navigate to the HonsProj-master directory and install dependencies
cd ../HonsProj-master || exit
echo "Installing dependencies for HonsProj-master..."
npm install

# Start the HonsProj-master application
echo "Starting HonsProj-master application..."
npm start &

# Return to the original directory
cd ..
