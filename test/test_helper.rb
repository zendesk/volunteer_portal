ENV['RAILS_ENV'] ||= 'test'

require 'bundler/setup'
require 'single_cov'

SingleCov.setup :minitest
SingleCov::APP_FOLDERS.concat %w[
  presenters
  graphql
  middleware
]

require File.expand_path('../config/environment', __dir__)
require 'rails/test_help'
require 'mocha/mini_test'
require 'minitest/rails'
require 'webmock/minitest'
require 'timecop'
require 'maxitest/autorun'

ENV["ZENDESK_SUBDOMAIN"] = "volunteer"
ENV["ZENDESK_API_HOST"]  = "example.com"
ENV["ZENDESK_API_USER"]  = "volunteer@example.com"
ENV["ZENDESK_API_KEY"]   = "123"

# Use ActiveSupport::TestCase for everything that was not matched before
# this is needed to test presenters
MiniTest::Spec::DSL::TYPES[-1] = [//, ActiveSupport::TestCase]

class ActiveSupport::TestCase
  extend MiniTest::Spec::DSL

  fixtures :all

  def sign_in(user)
    ApplicationController.any_instance.stubs(current_user: user)
  end

  def setup
    super
    stub_request(:get, "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest")
      .to_return(status: 200, body: "", headers: {})

    Signup.any_instance.stubs(:create_google_event).returns(true)
    Signup.any_instance.stubs(:delete_google_event).returns(true)
  end

  def self.it_includes(includes, options = {})
    action = options.fetch(:action, :index).to_sym
    params = options.fetch(:params, {})

    describe 'includes' do
      includes.each do |sideload|
        it "includes #{sideload} when requested" do
          get action, params: params.merge(includes: sideload)

          _, json = JSON.parse(@response.body).first
          json = json.first if json.is_a?(Array)
          json.keys.must_include sideload
        end
      end
    end
  end

  def self.it_presents_keys(expected_keys, options = {})
    it 'renderes the expected keys' do
      presenter = options[:presenter] || self.class.name.constantize.new(nil, url_builder: self)
      model = options[:model] || presenter.model_key.to_s.capitalize.constantize.new

      expected_keys << 'url'
      presented_keys = presenter.present(model)[presenter.model_key].keys.map(&:to_s)

      missing_keys = expected_keys - presented_keys
      extra_keys   = presented_keys - expected_keys

      assert missing_keys.empty?, "The following keys were missing: #{missing_keys}"
      assert extra_keys.empty?, "The following keys should not be present: #{extra_keys}"
    end
  end

  def self.authenticated
    setup { sign_in users(:a) }
    yield
  end

  def self.as_an_admin
    setup { sign_in users(:admin) }
    yield
  end

  def assert_valid(record)
    assert record.valid?, record.errors.full_messages.join(", ")
  end

  def refute_valid(record)
    assert_not record.valid?, record.errors.full_messages.join(", ")
  end
end
