require_relative '../../test_helper'

SingleCov.covered!

describe EventTypeResolver do
  describe '.all' do
    it 'only return active event_types in alphabetical order' do
      EventType.delete_all
      deleted_at = Time.zone.local(2020, 1, 1, 1, 0)
      event1 = EventType.create!(title: 'test1')
      event3 = EventType.create!(title: 'test3')
      event2 = EventType.create!(title: 'test2')
      EventType.create!(title: 'test4', deleted_at: deleted_at)

      all_events = EventTypeResolver.all
      assert_equal [event1, event2, event3], all_events
    end
  end

  describe '.create' do
    it 'creates a new event type' do
      input = stub(title: 'Test Type')

      EventTypeResolver.create(nil, { input: input }, nil)

      e = EventType.last

      assert_nil e.deleted_at
      assert_equal 'Test Type', e.title
    end
  end

  describe '.update' do
    let(:event_type) { event_types(:minimum) }

    it 'updates the given event type' do
      input = stub(id: event_type.id, title: 'Another Type')

      EventTypeResolver.update(nil, { input: input }, nil)

      e = EventType.find(event_type.id)

      assert_equal 'Another Type', e.title
    end
  end

  describe '.delete' do
    let(:event_type) { event_types(:minimum) }
    it 'deletes the given event type' do
      EventTypeResolver.delete(nil, { id: event_type.id }, nil)

      e = EventType.find(event_type.id)

      assert_not_nil e.deleted_at
    end
  end
end
