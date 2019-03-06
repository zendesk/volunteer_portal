module Mutations
  class DeleteOffice < BaseMutation
    require_admin

    null true

    argument :id, ID, required: true

    def resolve(**args)
      OfficeResolver.delete(object, args, context)
    end
  end
end
