require_relative '../../test_helper'

SingleCov.covered!

describe EventResolver do
  let(:type) { event_types(:minimum) }
  let(:org) { organizations(:minimum) }
  let(:office) { offices(:remote) }

  describe '.create' do
    it 'creates a new event' do
      timestamp = Time.now.utc
      attrs = {
        'title' => 'new',
        'description' => 'newd',
        'eventType' => { 'id' => type.id },
        'organization' => { 'id' => org.id },
        'office' => { 'id' => office.id },
        'location' => 'newl',
        'startsAt' => timestamp.iso8601,
        'endsAt' => (timestamp + 10.minutes).iso8601,
        'capacity' => 10,
      }

      EventResolver.create(nil, {input: attrs}, nil)

      e = Event.last

      assert_equal 'new', e.title
      assert_equal 10, e.capacity
      assert_equal timestamp.to_s(:db), e.starts_at.to_s(:db)
    end
  end

  describe '.update' do
    let(:event) { events(:minimum) }

    it 'updates the given event id' do
      timestamp = Time.now.utc
      attrs = {
        'id' => event.id,
        'title' => 'new',
        'description' => 'newd',
        'eventType' => { 'id' => type.id },
        'organization' => { 'id' => org.id },
        'office' => { 'id' => office.id },
        'location' => 'newl',
        'startsAt' => timestamp.iso8601,
        'endsAt' => (timestamp + 10.minutes).iso8601,
        'capacity' => 10,
      }

      EventResolver.update(nil, {input: attrs}, nil)

      e = Event.find(event.id)

      assert_equal 'new', e.title
      assert_equal 10, e.capacity
      assert_equal timestamp.to_s(:db), e.starts_at.to_s(:db)
    end
  end
end
