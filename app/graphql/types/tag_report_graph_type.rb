module Types
  class TagReportGraphType < BaseObject
    graphql_name 'TagReport'
    description 'Tag for events and how many minutes'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    #### Properties
    field :id, ID, null: false
    field :name, String, null: false
    field :minutes, Int, null: false
  end
end
