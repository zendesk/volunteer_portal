RoleGraphType = GraphQL::ObjectType.define do
  name 'Role'
  description 'A role'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id,   !types.ID
  field :name, !types.String
end
