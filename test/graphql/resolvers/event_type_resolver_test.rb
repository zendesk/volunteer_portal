require_relative '../../test_helper'

SingleCov.covered!

describe EventTypeResolver do
  describe '.create' do
    it 'creates a new event type' do
      input = stub(title: 'Test Type')

      EventTypeResolver.create(nil, {input: input}, nil)

      e = EventType.last

      assert_equal 'Test Type', e.title
    end
  end

  describe '.update' do
    let(:event_type) { event_types(:minimum) }

    it 'updates the given event type' do
      input = stub(id: event_type.id, title: 'Another Type')

      EventTypeResolver.update(nil, {input: input}, nil)

      e = EventType.find(event_type.id)

      assert_equal 'Another Type', e.title
    end
  end

  describe '.delete' do
    let(:event_type) { event_types(:minimum) }
    it 'deletes the given event type' do
      EventTypeResolver.delete(nil, {id: event_type.id}, nil)

      e = EventType.where(id: event_type.id)

      assert_empty e
    end
  end
end
