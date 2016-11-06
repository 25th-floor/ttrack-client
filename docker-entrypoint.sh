#!/bin/bash
set -e

if [ "$1" = 'ttrack-server' ]; then

	if [[ "$2" = "prod" || "$2" = "beta" ]]; then
		__conf="config/env_${2}.list"
		if [[ -f ${__conf} ]]; then
			echo "Loading config from ${__conf}"
			source ${__conf}
		fi
	fi

	# Required parameters
	: "${DB_USER:?Must be set}"
	: "${DB_PASS:?Must be set}"
	: "${DB_DATABASE:?Must be set}"
	: "${DB_HOST:?Must be set}"

	# Optional parameters with postgres defaults
	: "${DB_PORT:=5432}"
	: "${DB_DRIVER:=pg}"
	: "${DB_SCHEMA:=public}"

	printf '{"sql-file" : true, "dev": {"user": "%s", "password": "%s", "database": "%s", "port": "%s", "host": "%s",
		"driver": "%s", "schema": "%s"}}\n' \
		"$DB_USER" "$DB_PASS" "$DB_DATABASE" "$DB_PORT" "$DB_HOST" "$DB_DRIVER" "$DB_SCHEMA" \
		> ./database.json

	# Migrate database to latest version
	node_modules/.bin/db-migrate up

	# Hand over to the node server
	exec node --use-strict ./src/server/index.js
fi

exec "$@"
