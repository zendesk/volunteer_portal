require 'unicorn_wrangler'

unicorn_timeout = Integer(ENV["UNICORN_TIMEOUT"] || 30)

worker_processes Integer(ENV["UNICORN_WORKERS"] || 3)
timeout unicorn_timeout
preload_app true
listen ENV.fetch('PORT', '3000')

# - close connection since we do not need them in the master
# - run gc before forking to start with as little memory as possible
first_fork = true
before_fork do |_server, _worker|
  if first_fork
    first_fork = false
    ActiveRecord::Base.connection.disconnect!
    GC.start
  end
end

if (ENV['RAILS_ENV'] || 'development') != 'development'
    require 'datadog/statsd'
    stats = Datadog::Statsd.new(ENV.fetch('STATSD_HOST'), ENV.fetch('STATSD_PORT'), namespace: 'volunteer')
end

# dev base usage is about 150M ... production is 100M
# (osx counts only exclusive memory, ubuntu counts shared memory too)
# so we leave every worker about a bit of room for growth
UnicornWrangler.setup(
  kill_after_requests: 1000,
  kill_on_too_much_memory: {
    max: 800, # MB
    check_every: 150 # requests
  },
  gc_after_request_time: (unicorn_timeout * 0.75).round, # seconds
  logger: set.fetch(:logger),
  stats: stats
)

# Production uses a file cache which will fill up the whole disk
# clear cache when a worker reaches 1000 requests
UnicornWrangler.handlers << -> (requests, _request_time) do
  if (requests % 1000).zero?
    puts "Clearing cache"
    Rails.cache.clear
  end
end
