require_relative '../../test_helper'

SingleCov.covered!

describe VolunteerResolver do
  let(:user) { users(:admin) }
  let(:user2) { users(:a) }
  let(:office) { offices(:remote) }
  let(:office2) { offices(:madison) }

  before do
    Signup.delete_all
    IndividualEvent.delete_all
    user.update(office: office, role: Role.admin)
  end

  describe '.all' do
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

      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal User.all
    end

    it 'filters by current office' do
      args = { office_id: 'current' }
      context = { current_user: user }

      results = VolunteerResolver.all(nil, args, context).to_a

      results.must_equal [user]
    end

    it 'filters by office_id' do
      args = { office_id: office.id }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user]
    end

    it 'limits to count' do
      args = { count: 0 }
      results = VolunteerResolver.all(nil, args, nil).to_a

      results.must_equal []
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
  end
end
