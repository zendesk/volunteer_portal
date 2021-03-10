require_relative '../../test_helper'

SingleCov.covered!

describe Types::SensitiveObject do
  test_query = Class.new(Types::SensitiveObject)

  describe '#self.authorized?' do
    let(:context) { {} }
    let(:object) { {} }

    before do
      test_query.any_instance.stubs(object: object, context: context)
    end

    describe 'current_user is an admin' do
      let(:context) { { current_user: users(:admin) } }

      it 'returns true' do
        assert_equal true, test_query.authorized?(object, context)
      end
    end

    describe 'current_user is a volunteer' do
      let(:context) { { current_user: users(:a) } }

      it 'returns false' do
        assert_equal false, test_query.authorized?(object, context)
      end
    end
  end
end
