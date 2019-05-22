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
end
