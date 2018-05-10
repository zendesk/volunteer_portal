class EventsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'events'
  end
end
