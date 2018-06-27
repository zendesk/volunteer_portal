# Deploying your Volunteer Portal

* [Getting started](#getting-started)
  * [Create a Heroku account](#create-a-heroku-account)
  * [Decide on your Volunteer Portal's name and URL](#decide-on-your-volunteer-portals-name-and-url)
  * [Set up Google OAuth](#set-up-google-oauth)
* [Deploying your first Volunteer portal](#deploying-your-first-volunteer-portal)
* [Configuring optional features](#configuring-optional-features)
  * [Rollbar](#rollbar)
  * [Zendesk Web Widget](#zendesk-web-widget)
* [Redeploying your portal](#redeploying-your-portal)

## Getting started

### Create a Heroku account

If you already have a Heroku account, you can skip directly to [Deploying your first Volunteer Portal](#deploying-your-first-volunteer-portal).

1. Go to the [Heroku website](https://heroku.com)
2. Click sign up and follow the on screen steps
3. Make sure your account is verified by following up with the verification email

### Decide on your Volunteer Portal's name and URL

You'll need them in the steps to come. The portal's name should be concise and descriptive. For the URL there are two major options.

1. Use Heroku's automatically generated URL.

It will look like this: `[name of your app].herokuapp.com`. While this is convenient and easy, it needs to be unique among other Heroku apps and it may not be the easiest for your volunteers to remember.

2. Use a custom domain name.

You can connect any custom domain name you own to your Heroku deployment. We'll go over how to link the two later in the setup, but make sure you know what it is!

### Set up Google OAuth

Follow Google's [Setting up OAuth 2.0 page](https://support.google.com/cloud/answer/6158849?hl=en) documentation through the process of configuring a Google OAuth account. Please keep the following things in mind:

* Make sure you have an account that has permissions to create projects. You may need to create a new google account. Make sure you're logged in as this account the whole process.
* Your Application type should be "Web Application"
* Under the "Authorized redirect URIs" list your Volunteer Portal's URL with the appended `/auth/google_oauth2/callback`.
  For example, if your URL is `https://volunteer_portal.herokuapp.com`, you would list `https://volunteer_portal.herokuapp.com/auth/google_oauth2/callback`.
* If you have a custom domain name, also list it under "Authorized redirect URIs" with `/auth/google_oauth2/callback` appended.
* Keep your Client ID and Client secret handy. You'll need them later.

Once you have setup your OAuth application, you will need to [enable the Google+ API](https://developers.google.com/+/web/signin/#enable_the_google_api).
We use this additional API to get some extra user information like their language.

### Generate a secure encryption key

Some user information that gets saved will be encrypted before being added to the database. To do this, you need to generate a 32-byte secure key and _keep track of it_.
If you ever change this key, those encrypted user properties will become inaccessible without the original key. Here is a quick way to generate a key using ruby:

```
ruby -rsecurerandom -e 'puts SecureRandom.hex(16)'
```

## Deploying your first Volunteer Portal

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/zendesk/volunteer_portal/tree/master)

1. Click the Deploy to Heroku button above.
1. Fill out the form.
   The following inputs are required:

   * application name - you should have chosen [above](#decide-on-your-volunteer-portals-name-and-url)
   * `GOOGLE_CLIENT_ID` - acquired above during [google oauth setup](#setup-google-oauth)
   * `GOOGLE_CLIENT_SECRET` - acquired above during [google oauth setup](#setup-google-oauth)
   * `ATTR_ENCRYPTION_KEY` - the secure key generated [above](#generate-a-secure-encryption-key)
   * `HOST` - the absolute URL using the [name you chose or custom domain](#decide-on-your-volunteer-portals-name-and-url), for example: `https://volunteer_portal.herokuapp.com`

1. Click Deploy app!

## Configuring optional features

### Rollbar

Rollbar provides real-time error alerting and debugging tools for web applications. If you'd like to setup this for your hosted application you can put in your Rollbar URL and Access token in the fields provided. Read more about it on Rollbar's website [here](https://rollbar.com/).

### Zendesk Web Widget

Zendesk's Web Widget is embedded at the bottom of pages in case your volunteers need help. If you have a Zendesk account, simply input your domain `ZENDESK_DOMAIN` field and the widget will appear. For more about the web widget, read the Zendesk Web Widget documentation [here](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website).

## Redeploying your Portal

If you've made any updates to your Volunteer Portal following [our Development documentation](https://github.com/zendesk/volunteer_portal/blob/master/docs/development.md), you'll want to redeploy your Portal so it reflects the changes you've made.

The easiest way to see your changes is to deploy using git. The following instructions are cherry-picked from [the official Heroku documentation](https://devcenter.heroku.com/articles/git), so feel free to browse them directly for more in depth instructions or troubleshooting.

1. The first step is to download [the Heroku CLI](https://github.com/zendesk/volunteer_portal/blob/master/docs/development.md).  Follow the instructions for installation for the appropriate platform.
2. Log in to with the Heroku CLI by running `heroku login`. 
3. Find your app name, and make sure your shell's current directory is in your portal with your desired changes on a git branch.
4. Add your Heroku app to git's remote origin by running `heroku git:remote -a [APP NAME HERE].`
5. Deploy the changes with `git push heroku [BRANCH NAME]`.
6. If everything worked you should see your changes live!
