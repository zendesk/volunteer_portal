# Development

## Set up Google OAuth

Use the following links or if they've fallen out of date then Google's [Setting
up OAuth 2.0 page](https://support.google.com/cloud/answer/6158849?hl=en) should
guide you through the process.

1. Make sure you have an account that has permissions to create projects. You
   may need to create a new google account. Make sure you're logged in as this
   account for all following steps.
1. [Create a project](https://console.cloud.google.com/projectcreate)
1. Create "OAuth client ID" on the [Create credentials
   page](https://console.cloud.google.com/apis/credentials). (You may be told
   you need to set a project name for the consent screen, follow that link.)
   * Application type "Web Application"
   * You can use "http://localhost:5000" for `Authorized JavaScript origins` and
     "http://localhost:5000/auth/google_oauth2/callback" for `Authorized redirect URIs`.
   * Enter your "client ID" and "client secret" as `GOOGLE_CLIENT_ID` and
     `GOOGLE_CLIENT_SECRET` in `.env.development`
1. Create "Service Account Key" on the [Create credentials
   page](https://console.cloud.google.com/apis/credentials).
   * You'll likely have to create a new service account. I just entered in a
     random name and `Project > Owner` as the role.
   * Select JSON as the key type.
   * A JSON file will be downloaded. Grab the values from `private_key_id` and
     `private_key`, and put them into `GOOGLE_PRIVATE_KEY_ID` and
     `GOOGLE_PRIVATE_KEY` in `.env.development`.
1. [Enable the Google+ API](https://console.developers.google.com/apis/library/plus.googleapis.com/)

## Set up your Environment

1. Clone the project

   ```bash
   git clone git@github.com:zendesk/volunteer_portal.git
   cd volunteer_portal
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

1. Copy the `.env.development.example` file to `.env.development`

   ```bash
   cp .env.development.example .env.development
   ```

1. Update the development env values

   `ATTR_ENCRYPTION_KEY` will need to be set to a 32 byte value (eg: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa). If this is not set you will see `ArgumentError: key must be 32 bytes` in the next step.

1. Create your databases (make sure that PostgreSQL is running)

   ```bash
   ./bin/rails db:setup
   ```

## Start the App

Make sure that PostgreSQL is running.

We use `foreman` to run both the rails server and the webpack dev server in development.

```
bundle exec foreman start
```

The server will be running on [localhost:5000](http://localhost:5000/) by default.

## Running tests

Rails tests are provided via Minitest and frontend tests with Jest.

### Rails

To run backend tests:

```
bundle exec rake test
```

### Jest

To run frontend tests:

```
npm run test
```

lint-stage alongside Husky are used to ensure frontend tests are run on staged files via a precommit hook.

To manually run frontend tests on just staged files:

```
npm run precommit
```
