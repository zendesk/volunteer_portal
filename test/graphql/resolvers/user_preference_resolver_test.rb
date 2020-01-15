require_relative '../../test_helper'

SingleCov.covered!

describe UserPreferenceResolver do
  let(:user) { users(:a) }

  describe 'confirm_profile_settings' do
    it 'should set true' do
      context = { current_user: user }
      result = UserPreferenceResolver.confirm_profile_settings(context)
      assert_not_nil result
      assert_equal true, result.confirmed_profile_settings
    end
  end
end
