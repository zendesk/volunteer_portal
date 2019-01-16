# Zendesk Integrations
class ZendeskJob
  def self.bootstrap()
    @@hostname = ENV['ZENDESK_HOSTNAME']
    @@username = ENV['ZENDESK_USERNAME']
    @@password = ENV['ZENDESK_PASSWORD']
  end

  def self.has_zendesk_integration?()
    return @@hostname != nil && @@username != nil && @@password != nil
  end

  def self.create_ticket(description)
    # TODO: async this action, currently takes almost 2s to finish request. Modal is open for too long, confusing users whether action occurred or not.
    # ^ ALTERNATIVELY: add a loading spinner
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
  end
end
