require_relative '../../test_helper'

SingleCov.covered!

describe AssociationLoader do
  let(:office) { offices(:remote) }
  let(:user) { users(:admin) }

  before do
    user.office = office
    user.save!
    user.reload
  end

  it 'loads the correct association' do
    result = GraphQL::Batch.batch do
      AssociationLoader.for(User, :office).load(user)
    end

    result.id.must_equal office.id
  end

  it 'uses the scope passed in' do
    result = GraphQL::Batch.batch do
      AssociationLoader.for(User, :office, scope: Office.where(name: 'Fake Name')).load(user)
    end

    result.must_be_nil
  end

  it 'validates the association' do
    assert_raises ArgumentError do
      GraphQL::Batch.batch do
        AssociationLoader.for(User, :foobar)
      end
    end
  end
end
