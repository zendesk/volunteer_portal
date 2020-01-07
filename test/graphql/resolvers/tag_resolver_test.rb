require_relative '../../test_helper'

SingleCov.covered!

describe TagResolver do
  describe '.create' do
    it 'creates a new tag' do
      input = stub(
        name: 'Education'
      )

      TagResolver.create(nil, { input: input }, nil)

      t = Tag.last

      assert_equal 'Education', t.name
    end
  end

  describe '.delete' do
    let(:tag) { tags(:minimum) }

    it 'deletes the tag' do
      id = tag.id
      args = { id: id }

      TagResolver.delete(nil, args, nil)

      assert_nil Tag.find_by(id: id)
    end
  end
end
