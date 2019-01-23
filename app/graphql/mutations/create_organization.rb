module Mutations
  class CreateOrganization < BaseMutation
    null true

    argument :input, Types::Input::EditOrganizationInputType, required: true

    def resolve(**args)
      OrganizationResolver.create(object, args, context)
    end
  end
end
