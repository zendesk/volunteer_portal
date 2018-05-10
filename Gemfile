source 'https://rubygems.org'

ruby File.read('.ruby-version').strip

gem 'rails', '~> 5.1'
gem 'rack-cors', '0.2.9', require: 'rack/cors'
gem 'puma'
gem 'daemons', require: false
gem 'pg', '~> 0.21' # https://github.com/rails/rails/issues/31673
gem 'delayed_job_active_record'
gem 'httpclient', '2.6.0.1', require: false
gem 'google-api-client', require: false
gem 'googleauth', '0.4.2', require: false
gem 'dotenv'
gem 'whenever', require: false
gem 'omniauth-google-oauth2'
gem 'sanitize'
gem 'stronger_parameters'
gem 'graphql', '~> 1.6'
gem 'graphql-batch'
gem 'graphiql-rails'
gem 'goldiloader', '~> 2.0'
gem 'large_object_store', require: false
gem 'samson_secret_puller'
gem 'nokogiri', '1.6.8', require: false # keep in sync with Dockerfile
gem 'rollbar'
gem 'responders', '~> 2.0' # TODO: remove this shit when admin UI is moved
gem 'rails-controller-testing'
gem 'dogstatsd-ruby'
gem 'activerecord-session_store'
gem 'redis'
gem 'attr_encrypted'
gem 'soft_deletion'
gem 'webpacker', '~> 2.0'
gem 'uglifier'
gem 'sass-rails'

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
end

group :test do
  gem 'webmock', require: false
  gem 'minitest-rails', require: false
  gem 'maxitest', require: false
  gem 'mocha', require: false
  gem 'timecop', require: false
  gem 'single_cov', require: false
end
