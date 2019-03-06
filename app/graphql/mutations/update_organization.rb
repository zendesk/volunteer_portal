module Mutations
  class UpdateOrganization < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditOrganizationInputType, required: true

    def resolve(**args)
      OrganizationResolver.update(object, args, context)
    end
  end
end
