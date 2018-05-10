require_relative '../../test_helper'

SingleCov.covered!

describe SignupCountLoader do
  let(:event1) { events(:minimum) }
  let(:event2) { events(:simple_event) }
  let(:user1) { users(:admin) }
  let(:user2) { users(:a) }

  before do
    Signup.delete_all
  end

  it 'loads the signup count for each event' do
    Signup.create!(user: user1, event: event1)
    Signup.create!(user: user1, event: event2)
    Signup.create!(user: user2, event: event2)

    result = GraphQL::Batch.batch do
      SignupCountLoader.load_many([event1, event2])
    end

    result.must_equal [1, 2]
  end
end
