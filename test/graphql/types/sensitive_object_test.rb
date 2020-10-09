require_relative '../../test_helper'

SingleCov.covered!

describe Types::SensitiveObject do
  class TestQuery < SensitiveObject
  end

  describe '#ready?' do
    let(:context) { {} }

    before do
      TestQuery.any_instance.stubs(context: context)
    end

    describe 'current_user is an admin' do
      let(:context) { { current_user: users(:admin) } }

      it 'returns true' do
        assert_equal true, SensitiveObject.self.authorized?
      end
    end

    describe 'current_user is a volunteer' do
      let(:context) { { current_user: users(:a) } }

      it 'raises an error' do
        assert_raises GraphQL::ExecutionError do
          TestQuery.new.ready?
        end
      end
    end
  end
end
