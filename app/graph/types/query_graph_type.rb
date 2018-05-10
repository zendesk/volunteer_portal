UserSortEnum = GraphQL::EnumType.define do
  name 'UserSortEnum'
  description 'How to sort the resulting list of users'

  value UserResolver::HOURS_DESC, 'Sort users by volunteering hours in descending order'
  value UserResolver::HOURS_ASC, 'Sort users by volunteering hours in ascending order'
end

QueryGraphType = GraphQL::ObjectType.define do
  name 'Query'
  description 'The query root for this schema'

  field :node, GraphQL::Relay::Node.field
  # field :nodes, GraphQL::Relay::Node.plural_field

  field :currentUser do
    type UserGraphType

    resolve -> (_, _, context) { context[:current_user] }
  end

  field :event do
    type EventGraphType

    argument :id, !types.ID

    resolve -> (_, args, _) do
      RecordLoader.for(Event).load(args[:id])
    end
  end

  field :events do
    type types[EventGraphType]

    argument :officeId, types.ID,  'the officeId the events belong to, can be set to "current" to use the current users office id'
    argument :after,    types.Int, 'earliest start time allowed'
    argument :before,   types.Int, 'latest start time allowed'

    resolve -> (_, args, context) do
      office_id = case args[:officeId]
      when 'all'
        nil
      when 'current'
        context[:current_user].office_id
      else
        args[:officeId]
      end

      events = Event.all
      events = events.for_office(office_id)          if office_id
      events = events.before(Time.at(args[:before])) if args[:before]
      events = events.after(Time.at(args[:after]))   if args[:after]
      events
    end
  end

  field :user do
    type UserGraphType

    argument :id, !types.ID

    resolve -> (_, args, _) do
      RecordLoader.for(User).load(args[:id])
    end
  end

  field :users do
    type types[UserGraphType]

    argument :officeId, types.ID
    argument :sortBy,   UserSortEnum
    argument :count,    types.Int, 'The number of users to return after sorting if sortBy is given'

    resolve UserResolver.method(:all)
  end

  field :office do
    type OfficeGraphType

    argument :id, !types.ID

    resolve -> (_, args, _) do
      RecordLoader.for(Office).load(args[:id])
    end
  end

  field :offices do
    type types[OfficeGraphType]

    resolve -> (_, _, _) { Office.all }
  end

  field :eventType do
    type EventTypeGraphType

    argument :id, !types.ID

    resolve -> (_, args, _) do
      RecordLoader.for(EventType).load(args[:id])
    end
  end

  field :eventTypes do
    type types[EventTypeGraphType]

    resolve -> (_, _, _) { EventType.all }
  end

  field :roles do
    type types[RoleGraphType]

    resolve -> (_, _, _) { Role.all }
  end

  field :organization do
    type OrganizationGraphType

    argument :id, !types.ID

    resolve -> (_, args, _) do
      RecordLoader.for(Organization).load(args[:id])
    end
  end

  field :organizations do
    type types[OrganizationGraphType]

    resolve -> (_, _, _) { Organization.all }
  end

  field :pendingIndividualEvents do
    type types[IndividualEventGraphType]

    resolve -> (_, _, _) { IndividualEvent.pending.all }
  end
end
