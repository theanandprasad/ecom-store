#!/bin/bash

# Cleanup script for database-related files in root directory
echo "Starting cleanup of database files from root directory..."

# Remove db directory
if [ -d "./db" ]; then
  echo "Removing db directory..."
  rm -rf ./db
fi

# Remove NeDB dependencies from root package.json
echo "Updating package.json to remove database dependencies..."
# Create a temporary file
node -e "
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Remove database-related dependencies
if (packageJson.dependencies) {
  delete packageJson.dependencies.nedb;
}
if (packageJson.devDependencies) {
  delete packageJson.devDependencies['@types/nedb'];
}

// Write updated package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
"

# Remove any database files in root
if ls ./*.db 2>/dev/null; then
  echo "Removing database files from root..."
  rm -f ./*.db
fi

# Check if there are any sqlite files
if ls ./*.sqlite* 2>/dev/null; then
  echo "Removing SQLite files from root..."
  rm -f ./*.sqlite*
fi

# Clean up node_modules only if necessary
read -p "Do you want to clean up node_modules and reinstall? (y/n) " answer
if [[ $answer == "y" ]]; then
  echo "Removing node_modules..."
  rm -rf ./node_modules
  echo "Installing dependencies..."
  npm install
fi

echo "Cleanup completed!" 