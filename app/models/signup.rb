require 'digest'

class Signup < ApplicationRecord
  belongs_to :event, touch: true
  belongs_to :user

  validates :user, :event, presence: true
  validates :user_id, uniqueness: { scope: :event_id }
  validates_associated :event

  # the websocket methods need tests after they are re-enabled
  # after_create_commit :notify_websocket_of_create

  private

  def notify_websocket_of_create
    notify_websocket(:create)
  end

  def notify_websocket_of_destroy
    notify_websocket(:destroy)
  end

  def notify_websocket(action_type)
    ActionCable.server.broadcast 'signups', type: action_type, signup: self
  end
end
