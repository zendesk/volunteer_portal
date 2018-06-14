require_relative '../test_helper'

SingleCov.covered! uncovered: 17

describe User do
  fixtures :offices

  describe 'validations' do
    let(:sf) { offices(:san_francisco) }

    let(:user) do
      User.new do |u|
        u.email = 'foo@example.com'
        u.office = sf
      end
    end

    it 'is valid' do
      assert_valid user
    end

    it 'does not count soft deleted users for uniqueness' do
      u2 = user.dup
      user.soft_delete
      assert u2.save
    end
  end

  describe '#full_name' do
    it 'is first and last name' do
      user = User.new
      user.first_name = 'Taylor'
      user.last_name = 'Swift'
      assert_equal 'Taylor Swift', user.full_name

      user.first_name = nil
      user.last_name = 'Jones'
      assert_equal 'Jones', user.full_name

      user.first_name = 'Zane'
      user.last_name = nil
      assert_equal 'Zane', user.full_name

      user.first_name = nil
      user.last_name = nil
      assert_equal '', user.full_name
    end
  end
end
