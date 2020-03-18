module Types
  class TagGraphType < BaseObject
    graphql_name 'Tag'
    description 'Tag for events'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    #### Properties
    field :id, ID, null: false
    field :name, String, null: false
  end
end
