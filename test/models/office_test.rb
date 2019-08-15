require_relative '../test_helper'

SingleCov.covered!

describe Office do
  describe 'validations' do
    before do
      Office.delete_all
    end

    it 'creates an identifier if necessary' do
      office = Office.new
      office.name = 'San Francisco'

      assert_valid office
      assert office.identifier = 'san_francisco'
    end

    it 'normalizes a given identifier' do
      office = Office.new
      office.name = 'San Francisco'
      office.identifier = 'San Fran'

      assert_valid office
      assert office.identifier = 'san_fran'
    end
  end

  describe '.default' do
    let(:remote) { offices(:remote) }

    it 'creates the default office if it doesnt exist' do
      Office.delete_all

      assert_not_nil Office.default
      assert_equal Office::DEFAULT_NAME, Office.last.name
    end

    it 'returns the default office from the DB' do
      assert_equal remote.id, Office.default.id
    end
  end
end
