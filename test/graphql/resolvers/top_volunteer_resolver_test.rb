require_relative '../../test_helper'

SingleCov.covered!

describe TopVolunteerResolver do
  let(:user_with_ind_event) { users(:admin) }
  let(:user_with_event) { users(:a) }
  let(:user_with_no_event) { users(:b) }
  let(:user_with_both_event_high) { users(:cat) }
  let(:user_with_both_event_low) { users(:minimum_volunteer) }
  let(:office1) { offices(:remote) }
  let(:office2) { offices(:madison) }
  let(:event1) { events(:minimum) }
  let(:event2) { events(:simple_event) }
  let(:event3) { events(:late_event) }

  describe '.all' do
    before do
      # users | event | individual_event | total_hour
      # user_with_event           | event1 |            | 120
      # user_with_both_event_high | event2 | 60 | 30 + 60
      # user_with_both_event_low  | event2 | 45 | 30 + 45
      # user_with_ind_event       |        | 75 | 75
      # user_with_no_event
      user_with_ind_event.update(office: office1, role: Role.admin)
      user_with_event.update(office: office2, role: Role.admin)

      user_with_ind_event.update(first_name: "user_with_ind_event")
      user_with_event.update(first_name: "user_with_event")
      user_with_no_event.update(first_name: "user_with_no_event")
      user_with_both_event_high.update(first_name: "user_with_both_event_high")
      user_with_both_event_low.update(first_name: "user_with_both_event_low")
      event1.update(starts_at: 2.weeks.ago, ends_at: (2.weeks.ago + 120.minutes))
      event2.update(starts_at: 4.days.ago, ends_at: (4.days.ago + 30.minutes))
      event3.update(starts_at: 3.days.ago, ends_at: (3.days.ago + 20.minutes))
      Signup.create!(user: user_with_event, event: event1)
      Signup.create!(user: user_with_both_event_high, event: event2)
      Signup.create!(user: user_with_both_event_low, event: event2)
      base = { description: 'help', organization: organizations(:minimum),
        event_type: event_types(:individual), office: office1, status: IndividualEvent::APPROVED,  }
      IndividualEvent.create!(**base, user_id: user_with_ind_event.id, duration: 75, date: 1.month.ago)
      IndividualEvent.create!(**base, user_id: user_with_both_event_high.id, duration: 60, date: 2.day.ago)
      IndividualEvent.create!(**base, user_id: user_with_both_event_low.id, duration: 45, date: 1.day.ago)
    end

    it 'limits with time bounds' do
      args = { after: 1.week.ago.to_i, before: 2.days.ago.to_i, sort_by: 'HOURS_DESC' }
      results = TopVolunteerResolver.all(nil, args, nil).to_a

      results.must_equal [user_with_both_event_high, user_with_both_event_low]
    end
  end
end
