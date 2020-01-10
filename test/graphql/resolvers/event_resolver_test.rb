require_relative '../../test_helper'

SingleCov.covered!

describe EventResolver do
  let(:type) { event_types(:minimum) }
  let(:org) { organizations(:minimum) }
  let(:office) { offices(:remote) }
  let(:tag) { tags(:minimum) }

  describe '.create' do
    it 'creates a new event' do
      timestamp = Time.now.utc
      input = stub(
        title: 'new',
        description: 'newd',
        event_type: stub(id: type.id),
        tags: [id: tag.id],
        organization: stub(id: org.id),
        office: stub(id: office.id),
        location: 'newl',
        starts_at: timestamp.iso8601,
        ends_at: (timestamp + 10.minutes).iso8601,
        capacity: 10
      )

      EventResolver.create(nil, { input: input }, nil)

      e = Event.last

      assert_nil e.deleted_at
      assert_equal 'new', e.title
      assert_equal 10, e.capacity
      assert_equal timestamp.to_s(:db), e.starts_at.to_s(:db)
    end
  end

  describe '.update' do
    let(:event) { events(:minimum) }

    it 'updates the given event id' do
      timestamp = Time.now.utc
      input = stub(
        id: event.id,
        title: 'new',
        description: 'newd',
        event_type: stub(id: type.id),
        tags: [id: tag.id],
        organization: stub(id: org.id),
        office: stub(id: office.id),
        location: 'newl',
        starts_at: timestamp.iso8601,
        ends_at: (timestamp + 10.minutes).iso8601,
        capacity: 10
      )

      EventResolver.update(nil, { input: input }, nil)

      e = Event.find(event.id)

      assert_equal 'new', e.title
      assert_equal 10, e.capacity
      assert_equal timestamp.to_s(:db), e.starts_at.to_s(:db)
    end
  end

  describe '.delete' do
    let(:event) { events(:minimum) }

    it 'deletes the event' do
      id = event.id
      args = { id: id }

      EventResolver.delete(nil, args, nil)
      actual = Event.find_by(id: id)

      assert_not_nil actual.deleted_at
    end
  end

  describe '.all' do
    let(:organization) { organizations(:minimum) }
    let(:event_type) { event_types(:minimum) }
    let(:office) { offices(:san_francisco) }
    let(:other_office) { offices(:madison) }
    let(:event1) do
      Event.create!(
        organization: organization,
        title: 'test1',
        type: event_type,
        tags: [],
        starts_at: event1_start,
        ends_at: event1_start + 1.hour,
        capacity: 10,
        location: 'somewhere',
        office: office
      )
    end
    let(:event2) do
      Event.create!(
        organization: organization,
        title: 'test2',
        type: event_type,
        tags: [],
        starts_at: event2_start,
        ends_at: event3_start + 1.hour,
        capacity: 10,
        location: 'somewhere',
        office: office
      )
    end
    let(:event3) do
      Event.create!(
        organization: organization,
        title: 'test3',
        type: event_type,
        tags: [],
        starts_at: event3_start,
        ends_at: event3_start + 1.hour,
        capacity: 10,
        location: 'somewhere',
        office: other_office
      )
    end
    let(:event4) do
      Event.create!(
        organization: organization,
        title: 'test4-deleted',
        type: event_type,
        tags: [],
        starts_at: event3_start,
        ends_at: event3_start + 1.hour,
        capacity: 10,
        location: 'somewhere',
        office: other_office,
        deleted_at: deleted_at
      )
    end
    let(:event1_start) { Time.zone.local(2018, 1, 1, 1, 0) }
    let(:event2_start) { Time.zone.local(2018, 1, 1, 2, 0) }
    let(:event3_start) { Time.zone.local(2018, 1, 1, 3, 0) }
    let(:deleted_at) { Time.zone.local(2018, 1, 1, 3, 0) }
    let(:current_user) { users(:admin) }
    let(:context) { { current_user: current_user } }

    let(:args) { {} }
    let(:all_events) { EventResolver.all(nil, args, context) }

    before do
      Event.delete_all
      event2
      event1
      event3
    end

    it 'returns all active events' do
      assert_equal [event2, event1, event3].map(&:title), all_events.pluck(:title)
    end

    describe 'when sorting by descending' do
      let(:args) { { sort_by: 'STARTS_AT_DESC' } }

      it 'returns latest events first' do
        assert_equal [event3, event2, event1].map(&:title), all_events.pluck(:title)
      end
    end

    describe 'when sorting by ascending' do
      let(:args) { { sort_by: 'STARTS_AT_ASC' } }

      it 'returns oldest events first' do
        assert_equal [event1, event2, event3].map(&:title), all_events.pluck(:title)
      end
    end

    describe 'for all offices' do
      let(:args) { { office_id: 'all' } }

      it 'returns all events' do
        assert_equal [event2, event1, event3].map(&:title), all_events.pluck(:title)
      end
    end

    describe 'for your office' do
      let(:args) { { office_id: 'current' } }

      it 'returns some events' do
        assert_equal [event2, event1].map(&:title), all_events.pluck(:title)
      end
    end
  end
end
