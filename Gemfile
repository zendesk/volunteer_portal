source 'https://rubygems.org'

ruby File.read('.ruby-version').strip

gem 'rails', '~> 5.2.4.4'
gem 'rack-cors', '~> 1.1.1', require: 'rack/cors'
gem 'puma'
gem 'daemons', require: false
gem 'pg', '~> 1.2' # https://github.com/rails/rails/issues/31673
gem 'dotenv'
gem 'omniauth-google-oauth2'
gem 'omniauth-saml'
gem 'stronger_parameters'
gem 'graphql', '~> 1.11'
gem 'graphql-batch'
gem 'graphiql-rails'
gem 'goldiloader', '~> 3.1'
gem 'rollbar'
gem 'activerecord-session_store'
gem 'attr_encrypted'
gem 'soft_deletion'
gem 'webpacker', '~> 5'
gem 'uglifier'
gem 'sass-rails'
gem 'active_record_union'
gem 'rack-attack'
gem 'google-api-client', '~> 0.48.0'

group :production do
  gem 'rails_12factor', '0.0.3'
end

group :development do
  gem 'ffaker', require: false
  gem 'brakeman', require: false
  gem 'foreman', require: false

  gem 'rack-mini-profiler'
  gem 'memory_profiler'
  gem 'flamegraph'
  gem 'stackprof'
end

group :development, :test do
  gem 'byebug'
  gem 'testrbl', require: false
  gem 'database_cleaner', require: false
  gem 'rubocop-rails', require: false
end

group :test do
  gem 'webmock', require: false
  gem 'minitest-rails', require: false
  gem 'minitest-ci', require: false
  gem 'maxitest', require: false
  gem 'mocha', require: false
  gem 'timecop', require: false
  gem 'single_cov', '1.6.0', require: false
  gem 'rails-controller-testing'
end
