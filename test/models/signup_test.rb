require_relative '../test_helper'

# the websocket methods need tests after they are re-enabled
# create_google_event is call asynchronously so we can't test it here
SingleCov.covered! uncovered: 7

describe Signup do
  fixtures :users, :events, :signups

  before do
    Signup.any_instance.unstub(:create_google_event)
    Signup.any_instance.unstub(:delete_google_event)
  end

  describe 'create' do
    let(:user) { users(:admin) }
    let(:event) { events(:minimum) }

    subject { Signup.where(user: user, event: event).build }

    before do
      Signup.delete_all
    end
  end

  describe 'destroy' do
    subject { signups(:minimum) }
  end
end
