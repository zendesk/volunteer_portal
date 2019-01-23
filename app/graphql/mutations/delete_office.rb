module Mutations
  class DeleteOffice < BaseMutation
    null true

    argument :id, ID, required: true

    def resolve(**args)
      OfficeResolver.delete(object, args, context)
    end
  end
end
