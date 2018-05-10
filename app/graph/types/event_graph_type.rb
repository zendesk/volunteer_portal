EventGraphType = GraphQL::ObjectType.define do
  name 'Event'
  description 'An event'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id,          !types.ID
  field :title,       !types.String
  field :description, !types.String
  field :capacity,    !types.Int
  field :location,    !types.String, 'The street address where the event is being held. e.g. "1019 Market St, San Francisco, CA 94103, USA"'
  field :officeId,    !types.ID, property: :office_id
  field :eventTypeId, !types.ID, property: :event_type_id
  field :startsAt,    !DatetimeType, property: :starts_at
  field :endsAt,      !DatetimeType, property: :ends_at

  field :signupCount do
    description 'The number of users signed up for the event'
    type !types.Int

    resolve -> (event, _, _) do
      SignupCountLoader.load(event)
    end
  end

  # TODO: deprecate
  field :duration do
    type types.Int
    description 'Duration of the event in minutes'

    resolve -> (event, _, _) do
      ((event.ends_at - event.starts_at) / 60.0).round.to_i
    end
  end

  # TODO: deprecate
  field :signups do
    description 'The many-to-many association that connects users to events'
    type types[SignupGraphType]

    resolve -> (event, _, _) do
      AssociationLoader.for(Event, :signups).load(event)
    end
  end

  field :users do
    type types[UserGraphType]

    resolve -> (event, _, _) do
      AssociationLoader.for(Event, :users).load(event)
    end
  end

  field :organization do
    type OrganizationGraphType

    resolve -> (event, _, _) do
      AssociationLoader.for(Event, :organization).load(event)
    end
  end

  field :eventType do
    type EventTypeGraphType

    resolve -> (event, _, _) do
      AssociationLoader.for(Event, :event_type).load(event)
    end
  end

  field :office do
    type OfficeGraphType

    resolve -> (event, _, _) do
      AssociationLoader.for(Event, :office).load(event)
    end
  end
end
