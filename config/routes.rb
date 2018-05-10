Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql'

  root 'standalone#portal'

  get 'volunteer/ping', to: 'ping#index'
  get 'z/ping',         to: 'ping#index'

  get 'portal',        to: 'standalone#portal'
  get 'portal/*other', to: 'standalone#portal'

  scope :auth, controller: :omniauth_callbacks do
    get    :login
    get    ':provider/callback', action: :callback
    get    :failure
    get    :logout
    delete :logout
  end

  post   '/graphql', to: 'graphql#create'
  get    '/users/sign_out', to: 'omniauth_callbacks#logout'
  delete '/users/sign_out', to: 'omniauth_callbacks#logout'

  # can't connect to redis yet, so no ActionCable
  # mount ActionCable.server => '/cable'

  match '*all' => 'application#cors_preflight_check', via: :options
end
