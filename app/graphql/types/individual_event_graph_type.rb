module Types
  class IndividualEventGraphType < BaseObject
    graphql_name 'IndividualEvent'
    description 'An individual event'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    #### Properties
    field :id,          ID,     null: false
    field :description, String, null: false
    field :date,        String, null: false, description: 'Date of the event in ISO 8601 format: `YYYY-MM-DD` e.g. "2017-11-30"'
    field :duration,    Int,    null: false, description: 'Duration of the event in minutes'
    field :status,      Enum::IndividualEventStatusEnum, null: false

    #### Associations
    field :user, UserGraphType, null: true
    def user
      AssociationLoader.for(IndividualEvent, :user).load(object)
    end

    field :organization, OrganizationGraphType, null: true
    def organization
      AssociationLoader.for(IndividualEvent, :organization).load(object)
    end

    field :event_type, EventTypeGraphType, null: true
    def event_type
      AssociationLoader.for(IndividualEvent, :event_type).load(object)
    end

    field :office, OfficeGraphType, null: true
    def office
      AssociationLoader.for(IndividualEvent, :office).load(object)
    end
  end
end
