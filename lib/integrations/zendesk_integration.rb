class ZendeskIntegration

  require 'zendesk_api'

  @client = ZendeskAPI::Client.new do |config|
    return unless ENV['ENABLE_ZENDESK_INTEGRATION'].presence
    config.url = ENV['ZENDESK_INTEGRATION_URL'].presence # .sub(/\/+$/, '') + '/api/v2'
    config.username = ENV['ZENDESK_INTEGRATION_USERNAME'].presence
    config.password = ENV['ZENDESK_INTEGRATION_PASSWORD'].presence
    config.token = ENV['ZENDESK_INTEGRATION_TOKEN'].presence
    config.access_token = ENV['ZENDESK_INTEGRATION_ACCESS_TOKEN'].presence
  end

  def self.configured?
    !@client.config.url.nil?
  end

  def self.create_ticket(description)
    return unless configured?

    ZendeskAPI::Ticket.create!(
      @client,
      :subject => "An individual event '#{description}' has been requested for approval.",
      :comment => { :body => 'Please visit the volunteer portal as an admin to verify this request.'}
    )
  end
end
