# Google's OAuth2 docs. Make sure you are familiar with all the options
# before attempting to configure this gem.
# https://developers.google.com/accounts/docs/OAuth2Login
host = ENV['HOST'] || 'http://localhost:3000'

Rails.application.config.middleware.use OmniAuth::Builder do
  # Default usage, this will give you offline access and a refresh token
  # using default scopes 'email' and 'profile'
  #
  #redirect_uri = "#{host}/auth/google_oauth2/callback"

  #options = {
  #  scope:        'email,profile,calendar',
  #  redirect_uri: redirect_uri,
  #  setup: ->(env) do
  #    env['omniauth.strategy'].options['token_params'] = {
  #      redirect_uri: redirect_uri
  #    }
  #  end
  #}

  #if domain = ENV['OAUTH_DOMAIN']
  #  options.merge!(hd: domain)
  #end

  #provider :google_oauth2, ENV.fetch('GOOGLE_CLIENT_ID'), ENV.fetch('GOOGLE_CLIENT_SECRET'), options

  provider :saml,
    #:assertion_consumer_service_url     => "#{host}/auth/saml/callback",
    :issuer                             => "exkk8qn3fulOQhj8Z0h7",
    :idp_sso_target_url                 => "https://zendesk-sandbox.oktapreview.com/app/zentestio_volunteerportaldev_1/exkk8qn3fulOQhj8Z0h7/sso/saml",
    :idp_cert                           => "-----BEGIN CERTIFICATE-----\nMIIDrjCCApagAwIBAgIGAWBqnDt3MA0GCSqGSIb3DQEBCwUAMIGXMQswCQYDVQQGEwJVUzETMBEG\nA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU\nMBIGA1UECwwLU1NPUHJvdmlkZXIxGDAWBgNVBAMMD3plbmRlc2stc2FuZGJveDEcMBoGCSqGSIb3\nDQEJARYNaW5mb0Bva3RhLmNvbTAeFw0xNzEyMTgxNzEwNTFaFw0yNzEyMTgxNzExNTFaMIGXMQsw\nCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzEN\nMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxGDAWBgNVBAMMD3plbmRlc2stc2Fu\nZGJveDEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAI0K7nVNUBuI/Q4z0H3+J2ZYNTX7ATPVJqHsHo+AlsdsMnjSH/MkkEhYYY53WI3o\nqn1w+5VbK5oUcPVlpjYJ5huLvTV/HtFE7aakLCD+6EWgrGEFjn+XXEVEFl5wuzSMt/yrf48sLT0U\nT+o1PLgmcXmQrAjROJe/gspgShozCVxaCTmAjCJ9nuDs6j9tAGMVHQBduo8mdFdhlz4zlGbeeKtW\nnn1aDhvmcVqvDrFjbspJRN3vUovhPFpPdVQzXdF6T5gZ4hLF0g8sPj4cggqvIseiZX8Sl6z9HmtN\nAiSU/Fb7OR7N+d+b1gdNaBrBDzEYAWn53bEi5CpYuLpsymsEvIsCAwEAATANBgkqhkiG9w0BAQsF\nAAOCAQEAcg284Otg/aAMywasEhTEtMiisqAU2UXaLHp/8HLHK7R1RCjkhYr9iQoo+JjLl6aTW/Lb\nJt9RUNoC54Igb+r3HvhjZoCMujiCFo/RC5NIrSKIWkkttgjsmpzXkydf45v4kpE2i6RUAGEXrXGW\nIHDAisBnF/y4XQzzPrLNQ0U/rcWwxTbLIp9WWa9MuZIYG+6ONnRQG1f3GOl9sptV7eoOjOC0IOi5\nse7M/Jkm3KI9vixChKQHUXVqoFQYxxDkjbIPW6XpuojaHKYDZvLlKe+R1w7GGqvR8saUePNo6ZVo\nRWNARhf2wOIo/bi5F7Aqhvg3+fNuGOQ79CJwnPS1xeCGVw==\n-----END CERTIFICATE-----"
end

OmniAuth.config.full_host = host
