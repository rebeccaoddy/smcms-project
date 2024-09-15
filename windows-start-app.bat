@echo off
:: Navigate to the origin directory and install dependencies
cd origin
echo Installing dependencies for origin...
start cmd /k "npm install"

:: Start the origin application
echo Starting origin application...
start cmd /k "npm start"

:: Navigate to the HonsProj-master directory and install dependencies
cd ..\HonsProj-master
echo Installing dependencies for HonsProj-master...
start cmd /k "npm install"

:: Start the HonsProj-master application
echo Starting HonsProj-master application...
start cmd /k "npm start"

:: Return to the original directory
cd ..
