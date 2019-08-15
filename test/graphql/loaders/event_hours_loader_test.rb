require_relative '../../test_helper'

SingleCov.covered!

describe EventHoursLoader do
  let(:user) { users(:admin) }
  let(:event1) { events(:find_kittens) }
  let(:event2) { events(:feed_the_kittens) }

  before do
    Signup.where(user_id: user.id).delete_all

    event1.update(starts_at: 1.week.ago, ends_at: (1.week.ago + 1.hour))
    event2.update(starts_at: 1.day.ago, ends_at: (1.day.ago + 75.minutes))

    Signup.create!(user: user, event: event1)
  end

  it 'returns the duration in hours of events the user is signed up for' do
    result = GraphQL::Batch.batch do
      EventHoursLoader.load(user)
    end

    result.must_equal 1
  end

  it 'respects the time boundaries when given' do
    Signup.create!(user: user, event: event2)

    result = GraphQL::Batch.batch do
      EventHoursLoader.for(after: 1.month.ago, before: 2.days.ago).load(user)
    end

    result.must_equal 1
  end

  it 'defaults to 0 for a user with no individual events' do
    Signup.delete_all

    result = GraphQL::Batch.batch do
      EventHoursLoader.load(user)
    end

    result.must_equal 0
  end
end
