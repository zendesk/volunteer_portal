module Types
  class EventGraphType < BaseObject
    graphql_name 'Event'
    description 'An event'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,            ID,           null: false
    field :title,         String,       null: false
    field :description,   String,       null: false
    field :capacity,      Int,          null: false
    field :office_id,     ID,           null: false
    field :event_type_id, ID,           null: false
    field :starts_at,     DatetimeType, null: false
    field :ends_at,       DatetimeType, null: false

    field :location, String,
          null: false,
          description: 'The street address where the event is being held. e.g. "1019 Market St, San Francisco, CA 94103, USA"'

    field :signup_count, Int, null: false, description: 'The number of users signed up for the event'
    def signup_count
      SignupCountLoader.load(object)
    end

    field :duration, Int,
          null: true,
          description: 'Duration of the event in minutes',
          deprecation_reason: 'Duration should be computed with `startsAt - endsAt` instead.'
    def duration
      ((object.ends_at - object.starts_at) / 60.0).round.to_i
    end

    field :signups, [SignupGraphType],
          null: true,
          description: 'The many-to-many association that connects users to events',
          deprecation_reason: '`Signup` is just a join of `User` and `Event` objects, use `users` directly.'
    def signups
      AssociationLoader.for(Event, :signups).load(object)
    end

    field :users, [UserGraphType], null: true
    def users
      AssociationLoader.for(Event, :users).load(object)
    end

    field :organization, OrganizationGraphType, null: true
    def organization
      AssociationLoader.for(Event, :organization).load(object)
    end

    field :event_type, EventTypeGraphType, null: true
    def event_type
      AssociationLoader.for(Event, :event_type).load(object)
    end

    field :office, OfficeGraphType, null: true
    def office
      AssociationLoader.for(Event, :office).load(object)
    end

    field :tags, [TagGraphType], null: true
    def tags
      AssociationLoader.for(Event, :tags).load(object)
    end
  end
end
