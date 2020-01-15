require_relative '../test_helper'

SingleCov.covered!

describe UserPreference do
  fixtures :users
  let(:user) { users(:a) }

  it 'creates user preference with default values' do
    preference = UserPreference.new(user: user)

    assert_equal user.id, preference.user_id
    assert_equal false, preference.confirmed_profile_settings
  end
end
