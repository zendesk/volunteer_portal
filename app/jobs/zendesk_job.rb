# Zendesk Integrations
class ZendeskJob
  cattr_accessor :hostname
  cattr_accessor :username
  cattr_accessor :password

  def self.bootstrap()
    @@hostname = ENV['ZENDESK_HOSTNAME']
    @@username = ENV['ZENDESK_USERNAME']
    @@password = ENV['ZENDESK_PASSWORD']
  end

  def self.has_zendesk_integration?()
    return @@hostname != nil && @@username != nil && @@password != nil
  end

  def self.create_ticket(description)
    # TODO: 
    # ^ Preferred: async this action, currently takes almost 2s to finish request. Modal is open for too long, confusing users whether action occurred or not.
    # ^ Alternative 1: add a loading spinner to suggest to user their request is being processed
    # ^ Alternative 2: force client to close modal even if ack not received for instant feedback
    if(!has_zendesk_integration?())
      return
    end
    @result = HTTParty.post("#{@@hostname}/api/v2/tickets.json",
      :body => {
          :ticket => {
            :comment => {
              :body => "Please visit the volunteer portal as an admin to verify this request."
            },
            :subject => "An individual event \"#{description}\" has been requested for approval."
        }
      }.to_json,
      :headers => { 'Content-Type' => 'application/json' },
      :basic_auth => {
        :username => @@username,
        :password => @@password
      })
    puts "HTTParty result:", @result
    @result
  end
end
