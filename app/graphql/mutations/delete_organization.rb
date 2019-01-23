module Mutations
  class DeleteOrganization < BaseMutation
    require_admin

    null true

    argument :id, ID, required: true

    def resolve(**args)
      OrganizationResolver.delete(object, args, context)
    end
  end
end
