require_relative '../../test_helper'

SingleCov.covered!

describe IndividualEventHoursLoader do
  let(:user) { users(:admin) }
  let(:organization) { organizations(:minimum) }
  let(:type) { event_types(:minimum) }
  let(:office) { offices(:remote) }

  before do
    IndividualEvent.where(user_id: user.id).delete_all

    base = { user_id: user.id, organization: organization, event_type: type, office: office }
    IndividualEvent.create!(**base, description: 'help', duration: 75, status: IndividualEvent::APPROVED, date: 1.month.ago)
    IndividualEvent.create!(**base, description: 'halp', duration: 60, status: IndividualEvent::APPROVED, date: 1.week.ago)
    IndividualEvent.create!(**base, description: 'holp', duration: 45, date: 1.day.ago)
  end

  it 'loads the duration of approved events in hours' do
    result = GraphQL::Batch.batch do
      IndividualEventHoursLoader.load(user)
    end

    result.must_equal 2
  end

  it 'respects the time boundaries when given' do
    result = GraphQL::Batch.batch do
      IndividualEventHoursLoader.for(after: 2.weeks.ago, before: 1.day.from_now).load(user)
    end

    result.must_equal 1
  end

  it 'defaults to 0 for a user with no individual events' do
    IndividualEvent.where(user_id: user.id).delete_all

    result = GraphQL::Batch.batch do
      IndividualEventHoursLoader.load(user)
    end

    result.must_equal 0
  end
end
