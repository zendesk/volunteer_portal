require 'google/apis/oauth2_v2'

# READ ONLY, DOES NOT CREATE USER
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

    render json: { response: "👌" }

    # TODO: Error handling
  end
end
