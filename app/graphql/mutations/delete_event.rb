module Mutations
  class DeleteEvent < BaseMutation
    require_admin

    null true

    argument :id, ID, required: true

    def resolve(**args)
      EventResolver.delete(object, args, context)
    end
  end
end
