class OmniauthCallbacksController < ActionController::Base
  protect_from_forgery with: :exception
  layout 'application'

  skip_before_action :verify_authenticity_token, only: :callback

  def login
    render :login
  end

  def callback
    case params[:provider]
    when 'google_oauth2'
      google_callback
    else
      render text: 'Unknown oauth provider', status: :forbidden
      return
    end
  end

  def failure
    @failure = true
    render :login
  end

  def logout
    reset_session
    redirect_to :login
  end

  private

  # TODO: get this from a common place like ApplicationController
  def user_signed_in?
    session[:user_id].present? && User.find_by(id: session[:user_id])
  end
  helper_method :user_signed_in?

  def google_callback
    auth = request.env['omniauth.auth']
    auth_info = auth['info']
    email     = auth_info['email']

    if email.blank?
      redirect_to '/auth/google_oauth2?auth_type=rerequest&scope=email'
      return
    end

    user = User.find_or_initialize_by(email: email) do |u|
      u.email       = email
      u.first_name  = auth_info['first_name']
      u.last_name   = auth_info['last_name']
    end

    # Update the user's info
    user.google_token = auth['credentials']['token']
    user.photo        = auth_info['image']
    user.locale       = request.env.dig('omniauth.auth', 'extra', 'raw_info', 'locale')

    user.save!

    session[:user_id] = user.id

    redirect_to params[:return_to] || :portal
  rescue ActiveRecord::RecordInvalid => e
    render text: e.message, status: :forbidden
  end
end
