require 'graphql/batch'

class PortalSchema < GraphQL::Schema
  use GraphQL::Batch

  mutation(Types::MutationType)
  query(Types::QueryType)
end
