class OmniauthCallbacksController < ActionController::Base
  protect_from_forgery with: :exception
  layout 'application'

  skip_before_action :verify_authenticity_token, only: :callback

  def login
    render :login
  end

  def callback
    auth_info = request.env['omniauth.auth']['info']
    email     = auth_info['email']

    user = User.find_or_initialize_by(email: email) do |u|
      u.email       = email
      u.first_name  = auth_info['first_name']
      u.last_name   = auth_info['last_name']
      u.photo       = auth_info['image']
      u.locale      = request.env.dig('omniauth.auth', 'extra', 'raw_info', 'locale')
    end

    user.save!

    session[:user_id] = user.id

    redirect_to params[:return_to] || :portal
  rescue ActiveRecord::RecordInvalid => e
    render text: e.message, status: :forbidden
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
end
