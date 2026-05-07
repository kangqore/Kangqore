#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip3 install -r requirements.txt

# Run the application
echo "Starting Intelligence Engine on port 8000..."
export PORT=8000
export ENVIRONMENT=development
python3 main.py
