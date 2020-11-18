require 'graphql/batch'

class PortalSchema < GraphQL::Schema
  class MutationForbiddenError < StandardError
  end

  use GraphQL::Batch

  # Override this hook to handle cases when `authorized?` returns false for an object:
  def self.unauthorized_object(error)
    # Add a top-level error to the response instead of returning nil:
    raise GraphQL::ExecutionError, "An object of type #{error.type.graphql_name} was hidden due to permissions"
  end

  mutation(Types::MutationType)
  query(Types::QueryType)
end
