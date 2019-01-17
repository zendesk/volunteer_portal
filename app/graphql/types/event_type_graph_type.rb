module Types
  class EventTypeGraphType < BaseObject
    graphql_name 'EventType'
    description 'A category of event'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,    ID,     null: false
    field :title, String, null: false
  end
end
