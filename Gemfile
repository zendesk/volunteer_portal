source 'https://rubygems.org'

ruby File.read('.ruby-version').strip

gem 'rails', '~> 5.1'
gem 'rack-cors', '~> 0.4.1', require: 'rack/cors'
gem 'puma'
gem 'daemons', require: false
gem 'pg', '~> 0.21' # https://github.com/rails/rails/issues/31673
gem 'dotenv'
gem 'omniauth-google-oauth2'
gem 'sanitize', '~> 4.6.3'
gem 'stronger_parameters'
gem 'graphql', '~> 1.6'
gem 'graphql-batch'
gem 'graphiql-rails'
gem 'goldiloader', '~> 2.0'
gem 'nokogiri', '~> 1.8.4', require: false
gem 'rollbar'
gem 'activerecord-session_store'
gem 'attr_encrypted'
gem 'soft_deletion'
gem 'webpacker', '~> 2.0'
gem 'uglifier'
gem 'sass-rails'
gem 'loofah', '~> 2.2.1'
gem 'rails-html-sanitizer', '~> 1.0.4'

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
  gem 'rails-controller-testing'
end
