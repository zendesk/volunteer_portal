SingleCov.not_covered!
class MiddlewareTest < ActionDispatch::IntegrationTest
  describe 'middleware Integration' do
    it "can call ping" do
      get '/volunteer/ping'
      _(@response.body).must_equal "OK"
    end
  end
end
