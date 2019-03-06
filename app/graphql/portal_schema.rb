require 'graphql/batch'

class PortalSchema < GraphQL::Schema
  class MutationForbiddenError < StandardError
  end

  use GraphQL::Batch

  mutation(Types::MutationType)
  query(Types::QueryType)
end
