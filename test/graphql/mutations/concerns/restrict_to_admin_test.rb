require_relative '../../../test_helper'

SingleCov.covered!

describe Mutations::Concerns::RestrictToAdmin do
  test_mutation = Class.new { include Mutations::Concerns::RestrictToAdmin }

  describe '#ready?' do
    let(:context) { {} }

    before do
      test_mutation.any_instance.stubs(context: context)
    end

    describe 'current_user is an admin' do
      let(:context) { { current_user: users(:admin) } }

      it 'returns true' do
        assert_equal true, test_mutation.new.ready?
      end
    end

    describe 'current_user is a volunteer' do
      let(:context) { { current_user: users(:a) } }

      it 'raises an error' do
        assert_raises PortalSchema::MutationForbiddenError do
          test_mutation.new.ready?
        end
      end
    end
  end
end
