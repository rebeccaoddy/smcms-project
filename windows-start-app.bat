@echo off
:: Navigate to the caseManagementSystem directory and install dependencies
cd caseManagementSystem
echo Installing dependencies for caseManagementSystem...
start cmd /k "npm install"

:: Start the caseManagementSystem application
echo Starting caseManagementSystem application...
start cmd /k "npm start"

:: Navigate to the HonsProj-master directory and install dependencies
cd ..\StudentMonitoringSystem
echo Installing dependencies for StudentMonitoringSystem...
start cmd /k "npm install"

:: Start the HonsProj-master application
echo Starting StudentMonitoringSystem application...
start cmd /k "npm start"

:: Return to the original directory
cd ..
