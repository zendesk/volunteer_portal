require 'google/apis/oauth2_v2'

# Allows session creation with google auth (read only, does not create user)
# rubocop:disable Rails/ApplicationController
class GauthController < ActionController::Base
  def verify_token
    body = JSON.parse(request.body.read)
    id_token = body["token"]

    # Verify the token
    oauth2 = Google::Apis::Oauth2V2::Oauth2Service.new
    userinfo = oauth2.tokeninfo(id_token: id_token)

    # Find the user
    user = User.find_by(email: userinfo.email)

    # Create Session
    session[:user_id] = user.id
    render json: { status: "ok" }
  end
end
# rubocop:enable Rails/ApplicationController
