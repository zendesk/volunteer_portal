require_relative 'boot'

require 'rails/all'
require_relative '../app/middleware/portal_redirect_middleware'

dotenv_file = File.expand_path("../.env.#{Rails.env}", __dir__)

if %w[test development].include?(Rails.env) && File.exist?(dotenv_file)
  require 'dotenv'
  Dotenv.load(dotenv_file)
end

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Portal
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.secret_key_base = if Rails.env.development? || Rails.env.test?
                               '469b1e2b5472df916e0815735f99b8994ea00612af39b0b0de0a1a024896a28f76cd48d7ea7b395ccf24b87bbff6de8ef083c03e2219c7c66abd19b729f5b88f'
                             elsif ENV['PRECOMPILE']
                               'bad-temp-secret-to-make-build-work'
                             else
                               ENV.fetch('SECRET_KEY_BASE')
                             end

    config.middleware.use PortalRedirectMiddleware
    config.middleware.use Rack::Deflater

    # Load all graphql types
    config.autoload_paths.concat [
      Rails.root.join('app', 'graphql', 'types'),
      Rails.root.join('app', 'graphql', 'loaders'),
      Rails.root.join('app', 'graphql', 'resolvers')
    ]

    config.assets.paths << Rails.root.join("public", "assets")

    unless Rails.env.test?
      logger           = ActiveSupport::Logger.new(STDOUT)
      logger.formatter = config.log_formatter
      config.logger    = ActiveSupport::TaggedLogging.new(logger)
    end
  end
end
