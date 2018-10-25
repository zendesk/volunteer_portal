#!/usr/bin/env bash
set -eux
psql -d postgres -c 'CREATE ROLE volunteer WITH LOGIN SUPERUSER'
bundle exec ./bin/rails db:setup
