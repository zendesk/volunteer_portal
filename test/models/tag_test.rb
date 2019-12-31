require_relative '../test_helper'

SingleCov.covered!

describe Tag do
  fixtures :tags
  it 'creates a tag' do
    tag = Tag.new name: 'Teg'
    assert tag.save
  end
end
