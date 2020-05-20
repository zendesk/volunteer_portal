source 'https://rubygems.org'

ruby File.read('.ruby-version').strip

gem 'rails', '~> 5.1.6.2'
gem 'rack-cors', '~> 1.0.5', require: 'rack/cors'
gem 'puma'
gem 'daemons', require: false
gem 'pg', '~> 0.21' # https://github.com/rails/rails/issues/31673
gem 'dotenv'
gem 'omniauth-google-oauth2'
gem 'omniauth-saml'
gem 'stronger_parameters'
gem 'graphql', '~> 1.8'
gem 'graphql-batch'
gem 'graphiql-rails'
gem 'goldiloader', '~> 2.0'
gem 'rollbar'
gem 'activerecord-session_store'
gem 'attr_encrypted'
gem 'soft_deletion'
gem 'webpacker', '~> 4.x'
gem 'uglifier'
gem 'sass-rails'
gem 'active_record_union'
gem 'rack-attack'

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
  gem 'minitest-rails', '3.0.0', require: false
  gem 'minitest-ci', require: false
  gem 'maxitest', require: false
  gem 'mocha', require: false
  gem 'timecop', require: false
  gem 'single_cov', '0.8.4', require: false
  gem 'rails-controller-testing'
end
