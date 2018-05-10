# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run Rails.application

# use Rack::Static,
#   :urls => ["/templates"],
#   :root => "public"

# run lambda { |env|
#   [
#     200,
#     {
#       'Content-Type'  => 'text/html',
#       'Cache-Control' => 'public, max-age=86400'
#     },
#     File.open('public/index.html', File::RDONLY)
#   ]
# }

use Rack::Cors do
  allow do
    origins '*'
    resource '/assets/*', :headers => :any, :methods => :get
  end

  allow do
    origins '*'
    resource '/api/*', :headers => :any, :methods => :get
  end
end
