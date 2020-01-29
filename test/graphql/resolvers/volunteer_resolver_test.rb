require_relative '../../test_helper'

SingleCov.covered!

describe VolunteerResolver do
  let(:user) { users(:admin) }
  let(:user2) { users(:a) }
  let(:user3) { users(:b) }
  let(:user4) { users(:cat) }
  let(:user5) { users(:minimum_volunteer) }
  let(:office) { offices(:remote) }
  let(:office2) { offices(:madison) }

  describe '.all' do
    before do
      Signup.delete_all
      IndividualEvent.delete_all
      user.update(office: office, role: Role.admin)
    end

    let(:event1) { events(:minimum) }
    let(:event2) { events(:simple_event) }
    let(:event3) { events(:late_event) }

    it 'limits with time bounds' do
      event1.update(starts_at: 2.weeks.ago, ends_at: (2.weeks.ago + 120.minutes))
      event2.update(starts_at: 4.days.ago, ends_at: (4.days.ago + 20.minutes))
      event3.update(starts_at: 3.days.ago, ends_at: (3.days.ago + 30.minutes))

      Signup.delete_all
      Signup.create!(user: user, event: event1)
      Signup.create!(user: user, event: event2)
      Signup.create!(user: user2, event: event3)

      args = { after: 1.week.ago.to_i, before: 2.days.ago.to_i, sort_by: 'HOURS_DESC' }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user2, user]
    end

    it 'filters by all offices' do
      args = { office_id: 'all' }

      Signup.create!(event: event1, user: user)
      Signup.create!(event: event2, user: user2)
      Signup.create!(event: event1, user: user3)
      Signup.create!(event: event2, user: user4)
      Signup.create!(event: event1, user: user5)

      results = Set.new(VolunteerResolver.all(nil, args, nil).to_a)
      users = Set.new(User.all)

      results.must_equal users
    end

    it 'filters by current office' do
      args = { office_id: 'current' }
      context = { current_user: user }

      Signup.create!(event: event1, user: user)
      results = VolunteerResolver.all(nil, args, context).to_a

      results.must_equal [user]
    end

    it 'filters by office_id' do
      args = { office_id: office.id }

      Signup.create!(event: event1, user: user)
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user]
    end

    describe 'given a count parameter' do
      before do
        Signup.create!(event: event1, user: user)
        Signup.create!(event: event2, user: user2)
      end

      describe 'when it is 0' do
        it 'returns no record' do
          args = { count: 0 }
          results = VolunteerResolver.all(nil, args, nil).to_a

          results.must_equal []
        end
      end

      describe 'when it is 1' do
        it 'returns 1 record' do
          args = { count: 1 }
          results = VolunteerResolver.all(nil, args, nil).to_a

          results.must_equal [user]
        end
      end
    end

    it 'sorts by sort_by' do
      event1.update(ends_at: event1.starts_at + 10.minutes)
      event2.update(ends_at: event2.starts_at + 20.minutes)

      Signup.create!(event: event1, user: user)
      Signup.create!(event: event2, user: user2)

      args = { sort_by: 'HOURS_ASC' }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user, user2]

      args = { sort_by: 'HOURS_DESC' }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user2, user]
    end

    it 'uses all given parameters' do
      event1.update(ends_at: event1.starts_at + 10.minutes)
      event2.update(ends_at: event2.starts_at + 20.minutes)

      Signup.create!(event: event1, user: user)
      Signup.create!(event: event2, user: user2)

      args = { count: 1, sort_by: 'HOURS_ASC' }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user]

      args = { count: 1, sort_by: 'HOURS_DESC' }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user2]
    end

    describe 'when user only has events' do
      it 'returns the correct duration' do
        args = {}
        duration = 10

        event1.update(ends_at: event1.starts_at + duration.minutes)
        Signup.create!(event: event1, user: user)
        results = VolunteerResolver.all(nil, args, nil).to_a.first.duration

        results.must_equal duration
      end
    end
  end

  describe 'individual_events' do
    let(:event1) { events(:minimum) }
    let(:individual_event1) { individual_events(:approved) }
    let(:individual_event2) { individual_events(:minimum) }

    describe 'when user has unapproved individual events' do
      it 'does not count unapproved hours' do
        args = {}
        duration = 10

        individual_event1.update(duration: duration, user: user2) # approved
        individual_event2.update(duration: duration, user: user2) # unapproved
        results = VolunteerResolver.all(nil, args, nil).find_by(id: user2).duration

        results.must_equal duration
      end
    end

    describe 'when user only has individual events' do
      it 'returns the correct duration' do
        args = {}
        duration = 10

        individual_event1.update(duration: duration, user: user2)
        results = VolunteerResolver.all(nil, args, nil).find_by(id: user2).duration

        results.must_equal duration
      end
    end

    describe 'when user has both events and individual events' do
      it 'returns the correct duration' do
        args = {}
        duration = 10

        event1.update(ends_at: event1.starts_at + duration.minutes)
        individual_event1.update(duration: duration)
        individual_event2.update(duration: duration, status: IndividualEvent::APPROVED)
        results = VolunteerResolver.all(nil, args, nil).to_a.first.duration

        results.must_equal duration * 3
      end
    end
  end
end
