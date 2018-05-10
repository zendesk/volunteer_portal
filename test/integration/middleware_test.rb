require_relative '../test_helper'

SingleCov.not_covered!

describe 'middleware Integration' do
  it "can call ping" do
    get '/volunteer/ping'
    @response.body.must_equal "OK"
  end
end
