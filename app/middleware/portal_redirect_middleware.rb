# frozen_string_literal: true
class PortalRedirectMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    if root_request?(env)
      headers = {
        'Location'      => '/portal',
        'Cache-Control' => 'max-age=86400, public'
      }

      return [301, headers, ['Redirect to the portal']]
    else
      @app.call(env)
    end
  end

  private

  def root_request?(env)
    env['ORIGINAL_FULLPATH'] == '/'
  end
end
