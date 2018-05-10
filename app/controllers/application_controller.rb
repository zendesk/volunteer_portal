class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :authenticate_user!

  skip_before_action :verify_authenticity_token, only: :cors_preflight_check
  skip_before_action :authenticate_user!, only: :cors_preflight_check

  def after_sign_in_path_for(resource)
    resource.role == Role.admin ? admin_path : portal_path
  end

  def cors_preflight_check
    headers['Access-Control-Allow-Origin'] = if Rails.env.production?
      'http://volunteer.zende.sk'
    else
      request.referer.include?('localhost') ? 'http://localhost:3000' : 'http://volunteer.zd-dev.com'
    end

    headers['Access-Control-Allow-Credentials'] = 'true'
    headers['Access-Control-Allow-Methods'] = %w[GET PUT PATCH POST DELETE].join(', ')
    headers['Access-Control-Allow-Headers'] = ['content-type']

    render nothing: true, status: :ok
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) rescue nil
  end
  helper_method :current_user

  def authenticate_user!
    return if current_user

    reset_session # make sure the session isn't poluted with a user_id we couldn't find
    redirect_to :login
  end

  def authorize_admin!
    return if Rails.env.development?

    redirect_to :portal if current_user.role != Role.admin
  end

  def user_signed_in?
    current_user.present?
  end
  helper_method :user_signed_in?
end
