namespace :volunteer do
  desc "Generate lots of fake data to test with"
  task generate_test_data: :environment do
    require 'ffaker'

    Rake::Task['db:seed'].invoke # ensure we have the base seeds before

    ActiveRecord::Base.logger = Logger.new(STDOUT)

    OFFICES = %w{Madison Dublin Copenhagen Melbourne}
    GROUPS = %w{Sales Sustaining Volunteer IT Orchid Bunyip Harriers Marketing}

    type_ids ||= EventType.pluck(:id)
    org_ids  ||= Organization.pluck(:id)

    office_ids ||= OFFICES.map do |o|
      Office.find_or_create_by!(name: o).id
    end

    ## Users
    100.times do
      begin
        User.create!(
          email: FFaker::Internet.email.gsub(/@.*?\z/, '@example.com'),
          office_id: office_ids.sample,
          group: GROUPS.sample,
          first_name: FFaker::Name.first_name,
          last_name: FFaker::Name.last_name,
          role_id: (rand < 0.1 ? 2 : 1), # rougly 10% admins
          locale: FFaker::Locale.code
        )
      rescue ActiveRecord::RecordInvalid
      end
    end

    ## EventTypes
    10.times do
      EventType.create!(title: FFaker::Lorem.word)
    end

    ## Organizations
    50.times do
      Organization.create!(
        name: FFaker::Company.name,
        description: FFaker::Company.bs,
        location: FFaker::Address.street_address,
        website: FFaker::Internet.http_url
      )
    end

    ## Events
    # create 0-5 events each day in a 1 month window on either side of now
    start = 1.month.ago
    (0..90).each do |i|
      date = start + i.send(:days)
      rand(5).times do
        event = Event.create!(
          description: FFaker::HipsterIpsum.sentences.join(' '),
          starts_at: date,
          ends_at: date + rand(3).hours,
          capacity: rand(300),
          organization_id: org_ids.sample,
          title: FFaker::HipsterIpsum.phrase,
          event_type_id: type_ids.sample,
          location: FFaker::Address.street_address,
          office_id: office_ids.sample
        )

        Signup.skip_callback(:commit, :after, :create_google_event) rescue nil
        event.users << User.all.to_a.sample(rand(event.capacity))
      end
    end
  end
end
