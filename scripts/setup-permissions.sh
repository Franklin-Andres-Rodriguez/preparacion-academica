#!/bin/bash

# scripts/setup-permissions.sh
# Set proper permissions for all scripts

# Make all shell scripts executable
find scripts -name "*.sh" -type f -exec chmod +x {} \;

echo "✅ Execute permissions set for all scripts in scripts/ directory"
echo "📋 Scripts ready:"
ls -la scripts/*.sh