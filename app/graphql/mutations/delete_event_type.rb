module Mutations
  class DeleteEventType < BaseMutation
    null true

    argument :id, ID, required: true

    def resolve(**args)
      EventTypeResolver.delete(object, args, context)
    end
  end
end
