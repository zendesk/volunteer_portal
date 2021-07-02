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

    it 'should set update user language preference' do
      context = { current_user: users(:a) }
      args = { id: 1 }
      result = UserPreferenceResolver.update_user_language_preference(nil, args, context)
      assert_not_nil result
      assert_equal 1, result[:id]
    end
  end
end
