module Types
  class UserGraphType < BaseObject
    graphql_name 'User'
    description 'A user'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,     ID,     null: false
    field :email,  String, null: false
    field :locale, String, null: true, description: 'A locale string provided by Google auth, e.g. "en" or "en-US"'
    field :photo,  String, null: true, description: 'Profile photo URL'
    field :group,  String, null: true, description: 'A group name this user is associated with'
    field :last_sign_in_at, DatetimeType, null: true

    field :name, String, null: true
    def name
      "#{object.first_name} #{object.last_name}"
    end

    field :timezone, String,
          null: false,
          description: 'Timezone name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) e.g. "America/Los_Angeles"'
    def timezone
      object.timezone || ApplicationRecord::DEFAULT_TIMEZONE
    end

    field :is_admin, Boolean, null: true
    def is_admin
      object.role == Role.admin
    end

    field :hours, Int, null: true do
      description 'Total number of volunteer hours. If `before` and `after` arguments are given, these hours are restricted to that range.'

      argument :after,  Int, required: false, description: 'The beginning of a time range within which to return volunteer hours'
      argument :before, Int, required: false, description: 'The end of a time range within which to return volunteer hours'
    end
    def hours(after:, before:)
      Promise.all(
        [
          EventHoursLoader.for(after: after, before: before).load(object),
          IndividualEventHoursLoader.for(after: after, before: before).load(object)
        ]
      ).then { |results| results.reduce(&:+) }
    end

    field :role, RoleGraphType, null: true
    def role
      AssociationLoader.for(User, :role).load(object)
    end

    field :office, OfficeGraphType, null: true
    def office
      AssociationLoader.for(User, :office).load(object)
    end

    field :preference, UserPreferenceGraphType, null: true
    def preference
      AssociationLoader.for(User, :user_preference).load(object)
    end

    field :individual_events, [IndividualEventGraphType], null: true
    def individual_events
      AssociationLoader.for(User, :individual_events).load(object)
    end

    field :signups, [SignupGraphType], null: true
    def signups
      AssociationLoader.for(User, :signups).load(object) # object.signups
    end
  end
end
