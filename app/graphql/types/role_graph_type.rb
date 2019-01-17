module Types
  class RoleGraphType < BaseObject
    graphql_name 'Role'
    description 'A role'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,   ID,     null: false
    field :name, String, null: false
  end
end
