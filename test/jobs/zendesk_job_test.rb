require_relative '../test_helper'

SingleCov.covered!

describe 'Zendesk Job' do
  hostname = 'https://hostname.com'
  username = 'username@email.com'
  password = '123456'
  describe 'boostraps zendesk job' do
    it 'bootstraps by getting environment variables' do
      ENV['ZENDESK_HOSTNAME'] = hostname
      ENV['ZENDESK_USERNAME'] = username
      ENV['ZENDESK_PASSWORD'] = password
      ZendeskJob.bootstrap()
      assert ZendeskJob.hostname == hostname
      assert ZendeskJob.username == username
      assert ZendeskJob.password == password
    end
  end
  
  describe 'has zendesk integration' do
    it 'should return true if zendesk variables are set' do
      ZendeskJob.hostname = hostname
      ZendeskJob.username = username
      ZendeskJob.password = password
      assert ZendeskJob.has_zendesk_integration?() == true
    end

    it 'should return false if zendesk variables are not set' do
      ZendeskJob.hostname = nil
      ZendeskJob.username = nil
      ZendeskJob.password = nil
      assert ZendeskJob.has_zendesk_integration?() == false
    end
  end

  describe 'create ticket' do
    it 'fails to create ticket if there is no zendesk integration' do
      ZendeskJob.hostname = nil
      ZendeskJob.username = nil
      ZendeskJob.password = nil
      stub_request(:post, "https://hostname.com/api/v2/tickets.json").
      with(body: "{\"ticket\":{\"comment\":{\"body\":\"Please visit the volunteer portal as an admin to verify this request.\"},\"subject\":\"An individual event \\\"\\\" has been requested for approval.\"}}",
           headers: {'Authorization'=>'Basic dXNlcm5hbWVAZW1haWwuY29tOjEyMzQ1Ng==', 'Content-Type'=>'application/json'}).
      to_return(status: 200, body: "", headers: {})
      assert ZendeskJob.create_ticket("") == nil
    end

    it 'sends a http request to create a ticket if there is zendesk integration' do
      stub_request(:post, "https://hostname.com/api/v2/tickets.json").
      with(body: "{\"ticket\":{\"comment\":{\"body\":\"Please visit the volunteer portal as an admin to verify this request.\"},\"subject\":\"An individual event \\\"\\\" has been requested for approval.\"}}",
           headers: {'Authorization'=>'Basic dXNlcm5hbWVAZW1haWwuY29tOjEyMzQ1Ng==', 'Content-Type'=>'application/json'}).
      to_return(status: 200, body: "", headers: {})
      ZendeskJob.hostname = hostname
      ZendeskJob.username = username
      ZendeskJob.password = password
      assert ZendeskJob.create_ticket("") != nil
    end
  end
  
end
