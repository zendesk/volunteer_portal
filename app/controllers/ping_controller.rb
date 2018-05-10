# This controller is being used by the rails health check performed after a
# deploy to determine if the rails restart was successful or not.
class PingController < ActionController::Base
  protect_from_forgery with: :exception

  def index
    render plain: 'OK'
  end
end
