require_relative '../../test_helper'

SingleCov.covered!

describe UserResolver do
  let(:user) { users(:admin) }
  let(:user2) { users(:a) }
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
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal [user2, user]
    end

    it 'filters by all offices' do
      args = { office_id: 'all' }

      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal User.all
    end

    it 'filters by current office' do
      args = { office_id: 'current' }
      context = { current_user: user }

      results = UserResolver.all(nil, args, context).to_a

      results.must_equal [user]
    end

    it 'filters by office_id' do
      args = { office_id: office.id }
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal [user]
    end

    it 'limits to count' do
      args = { count: 0 }
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal []
    end

    it 'sorts by sort_by' do
      event1.update(ends_at: event1.starts_at + 10.minutes)
      event2.update(ends_at: event2.starts_at + 20.minutes)

      Signup.create!(event: event1, user: user)
      Signup.create!(event: event2, user: user2)

      args = { sort_by: 'HOURS_ASC' }
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal [user, user2]

      args = { sort_by: 'HOURS_DESC' }
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal [user2, user]
    end

    it 'uses all given parameters' do
      event1.update(ends_at: event1.starts_at + 10.minutes)
      event2.update(ends_at: event2.starts_at + 20.minutes)

      Signup.create!(event: event1, user: user)
      Signup.create!(event: event2, user: user2)

      args = { count: 1, sort_by: 'HOURS_ASC' }
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal [user]

      args = { count: 1, sort_by: 'HOURS_DESC' }
      results = UserResolver.all(nil, args, nil).to_a

      results.must_equal [user2]
    end
  end

  describe 'individual_events' do
    let(:event1) { events(:minimum) }
    let(:event2) { events(:simple_event) }
    let(:individual_event1) { individual_events(:approved) }
    let(:individual_event2) { individual_events(:minimum) }

    describe 'when user has both events and individual events' do
      it 'does not return the correct order' do
        args = { count: 2, sort_by: 'HOURS_DESC' }
        user_duration = 10
        user2_duration = 35

        # user has 1 event and 2 individual events, each lasting 10 minutes
        event1.update(ends_at: event1.starts_at + user_duration.minutes)
        individual_event1.update(duration: user_duration)
        individual_event2.update(duration: user_duration)

        # user2 has 1 event lasting 35 minutes
        event2.update(ends_at: event2.starts_at + user2_duration.minutes)
        Signup.create!(event: event2, user: user2)

        results = UserResolver.all(nil, args, nil).to_a

        # A bug in the resolver causes duplicated minutes.
        # The correct order should be [user2, user], but
        # the bug returns an incorrect order [user, user2].
        # Do not rely on UserResolver for sorting by hours.
        # Use VolunteerResolver instead.
        results.must_equal [user, user2]
      end
    end
  end

  describe '.update' do
    describe 'when current user is an admin' do
      it 'updates with editable fields' do
        context = { current_user: user }
        args = {
          input: stub(id: user2.id, is_admin: false, office_id: office2.id)
        }

        new_user = UserResolver.update(nil, args, context)
        assert_equal Role.volunteer.id, new_user.role.id
        assert_equal office2.id, new_user.office.id
      end
    end

    describe 'when current user is updating self' do
      it 'updates with editable fields' do
        context = { current_user: user2 }
        args = {
          input: stub(id: user2.id, is_admin: true, office_id: office2.id)
        }

        new_user = UserResolver.update(nil, args, context)
        assert_not_equal Role.admin, new_user.role
        assert_equal office2.id, new_user.office.id
      end
    end
  end

  describe '.delete' do
    it 'destroys a user' do
      new_user = UserResolver.delete(nil, { id: user.id }, nil)

      assert new_user.destroyed?
    end
  end
end
