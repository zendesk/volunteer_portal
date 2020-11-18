module Types
  class SensitiveObject < GraphQL::Schema::Object
    def self.authorized?(object, context)
      super && (context[:current_user].role == Role.admin)
    end
  end
end
