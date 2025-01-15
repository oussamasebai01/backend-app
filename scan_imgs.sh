#!/bin/bash

# Check if an argument is provided
if [ $# -eq 0 ]; then
    echo "No Docker image name provided."
    echo "Usage: ./scan_imgs.sh <image_name>"
    exit 1
fi

# Capture the image name from the argument
IMAGE_NAME=$1

# Sanitize the image name for the output file (replace ":" and "/" with "_")
SAFE_IMAGE_NAME=$(echo "$IMAGE_NAME" | sed 's/:/_/g; s/\//_/g')

# Define the path for the repports directory
REPORTS_DIR="repports"

# Check if the repports directory exists
if [ ! -d "$REPORTS_DIR" ]; then
    echo "Directory 'repports' does not exist. Please create it before running the script."
    exit 1
fi

# Get the current date in YYYY-MM-DD format
CURRENT_DATE=$(date +%Y-%m-%d)

# Define the output file path with the current date and sanitized image name
OUTPUT_FILE="${REPORTS_DIR}/${CURRENT_DATE}_${SAFE_IMAGE_NAME}.txt"

# Run docker scout cves for the provided image and save the output to the repports directory
docker scout cves "$IMAGE_NAME" > "$OUTPUT_FILE"

# Inform the user
if [ $? -eq 0 ]; then
    echo "Vulnerability scan completed. Results saved to $OUTPUT_FILE"
else
    echo "Failed to run docker scout cves for the image: $IMAGE_NAME"
fi