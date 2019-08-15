require_relative '../test_helper'

SingleCov.covered! uncovered: 4

describe Event do
  fixtures :events, :users, :offices

  let(:sf) { offices(:san_francisco) }

  describe '#sign_up_user!' do
    let(:event) { events(:minimum) }
    let(:user) { users(:minimum_volunteer) }

    before do
      event.signups.delete_all
      event.users.must_be_empty
    end

    it 'signs the given user up for the event' do
      event.sign_up_user!(user)
      event.reload

      event.users.must_include user
    end

    describe 'user already signed up for event' do
      before do
        event.signups.delete_all
        event.sign_up_user!(user)
        event.reload
      end

      it 'not sign up the user again' do
        before = event.users.count

        event.sign_up_user!(user)

        event.reload.users.count.must_equal before
      end

      it 'add a useful error message' do
        event.sign_up_user!(user)

        event.errors.messages.to_s.must_match /Failed to signup/
      end
    end
  end

  describe '#remove_user!' do
    let(:event) { events(:minimum) }
    let(:user) { users(:minimum_volunteer) }

    before do
      event.signups.delete_all
      event.sign_up_user!(user)
    end

    it 'removes the given user from the event' do
      event.remove_user!(user)

      event.users.wont_include user
    end

    describe 'user is not signed up for the event' do
      before do
        event.remove_user!(user)
      end

      it 'not modify the event' do
        before = event.users.count

        event.remove_user!(user)

        event.reload.users.count.must_equal before
      end
    end
  end

  describe '#set_duration' do
    it 'sets duration when new event is created' do
      event = Event.new(
        organization: organizations(:kittens), type: event_types(:group),
        title: 'イベント', starts_at: Time.zone.now, ends_at: (Time.zone.now + 2.hours), capacity: 60,
        location: 'Location', office: sf
      )
      assert event.save
      assert event.duration == 120
    end

    it 'sets duration when start and end times are updated' do
      event = events(:minimum)
      event.starts_at = Time.zone.now
      event.ends_at = Time.zone.now + 2.hours
      assert event.save
      assert event.duration == 120
    end

    it 'does not set duration when start and end times are not updated' do
      event = events(:minimum)
      assert event.save
      assert_nil event.duration
    end
  end

  it "creates event" do
    event = Event.new(
      organization: organizations(:kittens), type: event_types(:group),
      title: 'イベント', starts_at: Time.zone.now, ends_at: (Time.zone.now + 2.hours), capacity: 60,
      location: 'Location', office: sf
    )
    assert event.save, event.errors.full_messages
  end

  it "ensure event ends after it starts" do
    event = Event.new(
      organization: organizations(:kittens), type: event_types(:group),
      title: 'イベント', starts_at: (Time.zone.now + 2.hours), ends_at: Time.zone.now, capacity: 60,
      location: 'Location', office: sf
    )
    assert_not event.save, event.errors.full_messages
  end

  it "does not save event without organization" do
    event = Event.new(
      title: 'イベント', starts_at: Time.zone.now, ends_at: (Time.zone.now + 2.hours), capacity: 60,
      location: 'Location', office: sf
    )
    assert_not event.save, event.errors.full_messages
  end

  it "does not save event without office" do
    event = Event.new(
      organization: organizations(:kittens), type: event_types(:group),
      title: 'イベント', starts_at: Time.zone.now, ends_at: (Time.zone.now + 2.hours), capacity: 60,
      location: 'Location'
    )
    assert_not event.save, event.errors.full_messages
  end

  it "adds users to event" do
    event = events(:find_kittens)

    assert_difference('event.users.size', 1) do
      event.users << users(:a)
      assert event.save, event.errors.full_messages
      assert_equal 1, event.users.size
    end
  end

  it "does not save event over capacity" do
    event = events(:find_kittens)
    event.users << [users(:a), users(:b)]
    assert_not event.save
  end
end
