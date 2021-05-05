require_relative '../test_helper'

SingleCov.covered!

describe Language do
  fixtures :language
  it 'creates a language' do
    language = Language.new(language_code: 'en', language_name: 'English')
    assert language.save
  end
end
