# Volunteer Portal

Volunteer Portal is a platform designed to present, track, and report volunteering opportunities. Whether you're a large company, small business, nonprofit, or just a group of amazing people, Volunteer Portal can help you be more active in your community.

* [About](#about)
  * [Deploying your own Volunteer Portal](#deploying-your-own-volunteer-portal)
  * [Develpment](#development)
    * [Set up Google OAuth](#set-up-google-oauth)
    * [Set up your Environment](#set-up-your-environment)
    * [Start the App](#start-the-app)
    * [Running tests](#running-tests)
* [Copyright and licence](#copy-right-and-license)

## About

### Deploying your own Volunteer Portal

To deploy your own volunteer portal, there are a few prerequsites and then a one-button deploy process if you want to use Heroku.

For detailed information, see [the deployment docs](docs/DEPLOY.md).

### Development

#### Set up your Environment

1. Clone the project

   ```bash
   git clone git@github.com:zendesk/volunteer_portal.git
   cd volunteer
   ```

1. Install the right version of ruby and node

   ```bash
   rbenv install
   nvm install
   ```

1. Install dependencies

   ```bash
   gem install bundler
   bundle install
   npm install
   ```

1. Install PostgreSQL

   The easiest thing is probably to use their app. http://postgresapp.com/

1. Create the `volunteer` database role

   ```bash
   psql -c 'CREATE ROLE volunteer WITH LOGIN SUPERUSER'
   ```

1. Install Node+NPM

   https://docs.npmjs.com/getting-started/installing-node

1. Copy the `.env.development.example` file to `.env.development`

   ```bash
   cp .env.development.example .env.development
   ```

1. Update the development env values

   `ATTR_ENCRYPTION_KEY` will need to be set to a 32 byte value (eg: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa). If this is not set you will see `ArgumentError: key must be 32 bytes` in the next step.

1. Create your databases (make sure that MySQL is running)

   ```bash
   ./bin/rails db:setup
   ```

#### Start the App

Make sure that PostgreSQL is running.

We use `foreman` to run both the rails server and the webpack dev server in development.

```
bundle exec foreman start
```

The server will be running on [localhost:5000](http://localhost:5000/) by default.

#### Running tests

Rails tests are provided via Minitest and frontend tests with Jest.

##### Rails

To run backend tests:

```
bundle exec rake test
```

##### Jest

To run frontend tests:

```
npm run test
```

lint-stage alongside Husky are used to ensure frontend tests are run on staged files via a precommit hook.

To manually run frontend tests on just staged files:

```
npm run precommit
```

## Copyright and license

Copyright 2018 Zendesk, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
