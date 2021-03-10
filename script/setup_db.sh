#!/usr/bin/env bash
set -eux
psql -h localhost -d postgres -c 'CREATE ROLE volunteer WITH LOGIN SUPERUSER'
bundle exec ./bin/rails db:setup
