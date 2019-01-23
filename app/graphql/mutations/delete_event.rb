module Mutations
  class DeleteEvent < BaseMutation
    null true

    argument :id, ID, required: true

    def resolve(**args)
      EventResolver.delete(object, args, context)
    end
  end
end
