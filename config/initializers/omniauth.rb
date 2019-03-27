host = ENV['HOST'] || 'http://localhost:3000'

Rails.application.config.middleware.use OmniAuth::Builder do
  if ENV['GOOGLE_CLIENT_ID']
    # Default usage, this will give you offline access and a refresh token
    # using default scopes 'email' and 'profile'
    #
    redirect_uri = "#{host}/auth/google_oauth2/callback"

    options = {
      scope:        'email,profile,calendar',
      redirect_uri: redirect_uri,
      setup: ->(env) do
        env['omniauth.strategy'].options['token_params'] = {
          redirect_uri: redirect_uri
        }
      end
    }

    if domain = ENV['OAUTH_DOMAIN']
      options.merge!(hd: domain)
    end

    provider :google_oauth2, ENV.fetch('GOOGLE_CLIENT_ID'), ENV.fetch('GOOGLE_CLIENT_SECRET'), options
  elsif ENV['OKTA_CLIENT_ID']
    provider :okta, ENV['OKTA_CLIENT_ID'], ENV['OKTA_CLIENT_SECRET'], {
      name: 'okta',
      client_options: {
        site:          "https://#{ENV['OKTA_ORG']}.okta.com",
        authorize_url: "https://#{ENV['OKTA_ORG']}.okta.com/oauth2/v1/authorize",
        token_url:     "https://#{ENV['OKTA_ORG']}.okta.com/oauth2/v1/token"
      }
    }
  else
    raise 'Please configure either Google Authentication or Okta.'
  end
end

OmniAuth.config.full_host = host
