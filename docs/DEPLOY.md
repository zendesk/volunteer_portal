Deploying your Volunteer Portal 
=====

- [Getting started](#getting-started)
  - [Create a Heroku account](#create-a-heroku-account)
  - [Decide on your Volunteer Portal's name and URL](#decide-on-your-volunteer-portals-name-and-url)
  - [Set up Google OAuth](#set-up-google-oauth)
- [Deploying your first Volunteer portal](#deploying-your-first-volunteer-portal)
- [Configuring optional features](#configuring-optional-features)
  - [Rollbar](#rollbar)
  - [Zendesk Web Widget](#zendesk-web-widget)
- [Redeploying your portal](#redeploying-your-portal)

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

You can connect any custom domain name you own to your Heroku deployment.  We'll go over how to link the two later in the setup, but make sure you know what it is!

### Set up Google OAuth

1. Follow Google's [Setting up OAuth 2.0 page](https://support.google.com/cloud/answer/6158849?hl=en) documentation through the process of configuring a Google OAuth account.  Please keep the following things in mind:

- Make sure you have an account that has permissions to create projects. You may need to create a new google account. Make sure you're logged in as this account the whole process.
- Your Application type should be "Web Application"
- Under the "Authorized redirect URIs" list your Volunteer Portal's URL with the appended `/auth/google_oauth2/callback`.
        For example, if your URL is `volunteer_portal.herokuapp.com`, you would list `volunteer_portal.herokuapp.com/auth/google_oauth2/callback`.
- If you have a custom domain name, also list it under "Authorized redirect URIs" with `/auth/google_oauth2/callback` appended.
- Keep your Client ID and Client secret handy. You'll need them later.

## Deploying your first Volunteer Portal

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/zendesk/volunteer_portal/tree/master)

1. Click the Deploy to Heroku button above.
2. Fill out the form.
        The only required inputs are your application name (which you should have chosen [above](#decide-on-your-volunteer-portals-name-and-url)), Google Client ID, and Client Secret.  If you want to configure other options, see [Configuring optional features](#configuring-optional-features).
3. Click Deploy app!

## Configuring optional features

### Rollbar

Rollbar provides real-time error alerting and debugging tools for web applications.  If you'd like to setup this for your hosted application you can put in your Rollbar URL and Access token in the fields provided. Read more about it on Rollbar's website [here](https://rollbar.com/).

### Zendesk Web Widget

Zendesk's Web Widget is embedded at the bottom of pages in case your volunteers need help.  If you have a Zendesk account, simply input your domain `ZENDESK_DOMAIN` field and the widget will appear.  For more about the web widget, read the Zendesk Web Widget documentation [here](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website).

## Redeploying your Portal

People will probably want to change things (branding, etc).  We need to explain how to install heroku cli and redeploy
