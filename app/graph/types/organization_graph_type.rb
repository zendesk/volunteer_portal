OrganizationGraphType = GraphQL::ObjectType.define do
  name 'Organization'
  description 'The organization that is hosting a volunteer event'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id,          !types.ID
  field :name,        !types.String
  field :description, !types.String
  field :location,    !types.String, 'The street address where the organization is located. e.g. "1019 Market St, San Francisco, CA 94103, USA"'
  field :website,      types.String, 'A valid URL for the organization'
end
