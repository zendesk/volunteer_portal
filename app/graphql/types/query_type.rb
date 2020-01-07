module Types
  class QueryType < Types::BaseObject
    graphql_name 'Query'
    description 'The query root for this schema'

    field :node, field: GraphQL::Relay::Node.field, null: true
    # field :nodes, field: GraphQL::Relay::Node.plural_field, null: true

    field :current_user, UserGraphType, null: true
    def current_user
      context[:current_user]
    end

    field :event, EventGraphType, null: true do
      argument :id, ID, required: true
    end
    def event(id:)
      RecordLoader.for(Event).load(id)
    end

    field :events, [EventGraphType], null: true do
      argument :office_id, ID,  required: false, description: 'the office_id the events belong to, can be set to "current" to use the current users office id'
      argument :after,     Int, required: false, description: 'earliest start time allowed'
      argument :before,    Int, required: false, description: 'latest start time allowed'
      argument :sort_by,   Enum::EventSortEnum, required: false
    end
    def events(**args)
      EventResolver.all(object, args, context)
    end

    field :user, UserGraphType, null: true do
      argument :id, ID, required: true
    end
    def user(id:)
      RecordLoader.for(User).load(id)
    end

    field :users, [UserGraphType], null: true do
      argument :office_id, ID, required: false
      argument :sort_by,   Enum::UserSortEnum, required: false
      argument :after,     Int, required: false, description: 'earliest start time allowed'
      argument :before,    Int, required: false, description: 'latest start time allowed'
      argument :count,     Int, required: false, description: 'The number of users to return'
    end
    def users(**args)
      UserResolver.all(object, args, context)
    end

    field :volunteers, [UserGraphType], null: true do
      argument :office_id, ID, required: false
      argument :sort_by,   Enum::UserSortEnum, required: false
      argument :after,     Int, required: false, description: 'earliest start time allowed'
      argument :before,    Int, required: false, description: 'latest start time allowed'
      argument :count,     Int, required: false, description: 'The number of users to return'
    end
    def volunteers(**args)
      VolunteerResolver.all(object, args, context)
    end

    field :office, OfficeGraphType, null: true do
      argument :id, ID, required: true
    end
    def office(id:)
      RecordLoader.for(Office).load(id)
    end

    field :offices, [OfficeGraphType], null: true do
      argument :sort_by, Enum::OfficeSortEnum, required: false
    end
    def offices(**args)
      OfficeResolver.all(object, args, context)
    end

    field :event_type, EventTypeGraphType, null: true do
      argument :id, ID, required: true
    end
    def event_type(id:)
      RecordLoader.for(EventType).load(id)
    end

    field :event_types, [EventTypeGraphType], null: true
    def event_types
      EventType.all
    end

    field :roles, [RoleGraphType], null: true
    def roles
      Role.all
    end

    field :organization, OrganizationGraphType, null: true do
      argument :id, ID, required: true
    end
    def organization(id:)
      RecordLoader.for(Organization).load(id)
    end

    field :organizations, [OrganizationGraphType], null: true
    def organizations
      Organization.all
    end

    field :pending_individual_events, [IndividualEventGraphType], null: true
    def pending_individual_events
      IndividualEvent.pending.all
    end

    field :tags, [TagGraphType], null: true
    def tags
      Tag.all
    end
  end
end
