module Mutations
  class BaseMutation < GraphQL::Schema::Mutation
    def self.require_admin
      include Concerns::RestrictToAdmin
    end
  end
end
