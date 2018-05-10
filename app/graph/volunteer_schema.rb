require 'graphql/batch'

Dir.glob('../loaders/*.rb') { |f| require f }
Dir.glob('../resolvers/*.rb') { |f| require f }

VolunteerSchema = GraphQL::Schema.define do
  query QueryGraphType
  mutation MutationGraphType

  use GraphQL::Batch

  id_from_object ->(object, type_definition, _query_ctx) do
    GraphQL::Schema::UniqueWithinType.encode(type_definition.name, object.id)
  end

  object_from_id ->(id, query_ctx) do
    type_name, item_id = GraphQL::Schema::UniqueWithinType.decode(id)
    Object.const_get(type_name).find(item_id)
  end

  resolve_type ->(obj, ctx) do
    VolunteerSchema.types[obj.class.name]
  end
end
