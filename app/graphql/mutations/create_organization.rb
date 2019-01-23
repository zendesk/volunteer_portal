module Mutations
  class CreateOrganization < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditOrganizationInputType, required: true

    def resolve(**args)
      OrganizationResolver.create(object, args, context)
    end
  end
end
