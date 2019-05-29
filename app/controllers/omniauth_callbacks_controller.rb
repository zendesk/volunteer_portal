class OmniauthCallbacksController < ActionController::Base
  protect_from_forgery with: :exception
  layout 'application'

  skip_before_action :verify_authenticity_token, only: :callback

  before_action :verify_callback_contents, only: :callback

  def login
    render :login
  end

  def callback
    set_user_photo
    set_user_metadata

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

  def auth_info
    @auth_info ||= request.env['omniauth.auth']['info']
  end

  def saml_response_attributes
    @saml_response_attributes ||= request.env['omniauth.auth'].extra.response_object.attributes
  end

  def user
    @user ||= User.find_or_initialize_by(email: auth_info['email']) do |u|
      u.email       = auth_info['email']
      u.first_name  = auth_info['first_name']
      u.last_name   = auth_info['last_name']
    end
  end

  def set_user_photo
    user.photo = auth_info['image'] if auth_info['image']
  end

  def set_user_metadata
    user.metadata = saml_response_attributes.attributes.keys.each_with_object({}) do |key, metadata|
      # Ignore default fields we already capture in user or don't care about
      next if ['first_name', 'last_name', 'email', 'fingerprint'].include?(key)
      metadata[key] = saml_response_attributes[key]
    end.to_json
  end

  # TODO: get this from a common place like ApplicationController
  def user_signed_in?
    session[:user_id].present? && User.find_by(id: session[:user_id])
  end
  helper_method :user_signed_in?

  def verify_callback_contents
    raise 'Authentication provider must provide email, first_name, and last_name parameters' unless (auth_info.keys & ['email', 'first_name', 'last_name']).size == 3
  end

end
