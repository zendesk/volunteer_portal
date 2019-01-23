module Mutations
  class DeleteUser < BaseMutation
    null true

    argument :id, ID, required: true

    def resolve(**args)
      UserResolver.delete(object, args, context)
    end
  end
end
