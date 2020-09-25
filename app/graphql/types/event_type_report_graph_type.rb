module Types
  class EventTypeReportGraphType < SensitiveObject
    graphql_name 'EventTypeReport'
    description 'A category of event and how many hours'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,    ID,     null: false
    field :title, String, null: false
    field :hours, Int,    null: false
  end
end
