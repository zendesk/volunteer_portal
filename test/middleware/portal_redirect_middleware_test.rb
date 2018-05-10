require_relative '../test_helper'

SingleCov.covered!

describe PortalRedirectMiddleware do
  let(:app) { stub }
  let(:middleware) { PortalRedirectMiddleware.new(app) }

  describe 'a request to the root URL' do
    let(:env) do
      { 'ORIGINAL_FULLPATH' => '/' }
    end

    it 'responds with 301 Moved Permanently' do
      app.expects(:call).never

      response, _headers, _body = middleware.call(env)

      response.must_equal 301
    end

    it 'sets the Location and Cache-Control headers' do
      app.expects(:call).never

      _response, headers, _body = middleware.call(env)

      headers['Location'].must_equal '/portal'
      headers['Cache-Control'].wont_be_nil
    end
  end

  describe 'a request to non-root URL' do
    let(:env) do
      { 'ORIGINAL_FULLPATH' => '/portal' }
    end

    it 'just continues without a redirect' do
      app.expects(:call).once

      middleware.call(env)
    end
  end
end
