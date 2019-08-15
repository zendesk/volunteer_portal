namespace :volunteer do
  desc "Promote a user to admin"
  task make_admin: :environment do |_task, params|
    email = params.extras.first
    puts "Making user `#{email}` an admin..."
    user = User.find_by!(email: email)
    user.role = Role.admin
    user.save!
  end

  desc "Generate lots of fake data to test with"
  task generate_test_data: :environment do
    require 'ffaker'

    ActiveRecord::Base.logger = nil

    Rake::Task['db:seed'].invoke # ensure we have the base seeds before

    OFFICES = ['San Francisco', 'Madison', 'Dublin', 'Copenhagen', 'Melbourne', Office.default.name].freeze
    GROUPS = %w[Sales Volunteer IT Orchid Marketing].freeze

    type_ids ||= EventType.pluck(:id)
    org_ids  ||= Organization.pluck(:id)

    office_ids ||= OFFICES.map do |o|
      Office.find_or_create_by!(name: o).id
    end

    ## Users
    print 'Creating 100 users... '
    100.times do
      User.create!(
        email: FFaker::Internet.email.gsub(/@.*?\z/, '@example.com'),
        office_id: office_ids.sample,
        group: GROUPS.sample,
        first_name: FFaker::Name.first_name,
        last_name: FFaker::Name.last_name,
        role_id: (rand < 0.1 ? Role.admin.id : Role.volunteer.id), # rougly 10% admins
        locale: FFaker::Locale.code
      )
    rescue ActiveRecord::RecordInvalid
    end
    puts 'Done!'

    ## EventTypes
    print 'Creating 10 event types... '
    10.times do
      EventType.create!(title: FFaker::Lorem.word)
    end
    puts 'Done!'

    ## Organizations
    print 'Creating 50 organizations... '
    50.times do
      Organization.create!(
        name: FFaker::Company.name,
        description: FFaker::Company.bs,
        location: FFaker::Address.street_address,
        website: FFaker::Internet.http_url
      )
    end
    puts 'Done!'

    ## Events
    puts 'Creating events and signing users up'
    # create 0-5 events each day in a 1 month window on either side of now
    start = 1.month.ago
    user_ids = User.all.pluck(:id)

    (0..90).each do |i|
      print '.'
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

        user_ids.sample(rand(event.capacity)).each do |user_id|
          Signup.create!(event_id: event.id, user_id: user_id)
        end
      end
    end
    puts "\nDone!"
  end
end
