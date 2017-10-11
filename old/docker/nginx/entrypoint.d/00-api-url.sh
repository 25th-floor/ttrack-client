#!/usr/bin/env bash

# Fail immediately if anything goes wrong and return the value of the last command to fail/run
set -eo pipefail

: ${API_URL:=http://localhost:3000}

perl -pi -e "s|http://localhost:3000|${API_URL}|g" /var/www/index.html