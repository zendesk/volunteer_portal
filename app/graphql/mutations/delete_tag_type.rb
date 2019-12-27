module Mutations
  class DeleteTagType < BaseMutation
    require_admin

    null true

    argument :id, ID, required: true

    def resolve(**args)
      TagResolver.delete(object, args, context)
    end
  end
end
