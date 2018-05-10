require_relative '../test_helper'

SingleCov.covered!

describe EventType do
  it 'creates event type' do
    event_type = EventType.new title: 'グループ'
    assert event_type.save, event_type.errors.full_messages
  end
end
