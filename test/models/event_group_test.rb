require_relative '../test_helper'

SingleCov.covered!

describe EventGroup do
  it 'creates event group' do
    event_group = EventGroup.new title: 'Event Group'
    assert event_group.save, event_group.errors.full_messages
  end
end
