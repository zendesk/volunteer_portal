class SignupsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'signups'
  end
end
