EventTypeGraphType = GraphQL::ObjectType.define do
  name 'EventType'
  description 'A category of event'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id,    !types.ID
  field :title, !types.String
end
