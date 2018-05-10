#!/bin/bash
set -v

# Download source clear script and scan the current directory for security issues in Open Source Components.

if [[ -z "$SRCCLR_API_TOKEN" ]]
then
    echo "Need SRCCLR_API_TOKEN before running sourceclear script"
    exit 1
fi

# Exit if download fails or host is not reachable.
set -o pipefail
curl -fsSL https://download.sourceclear.com/ci.sh | bash
