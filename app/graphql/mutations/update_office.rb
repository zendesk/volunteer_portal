module Mutations
  class UpdateOffice < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditOfficeInputType, required: true

    def resolve(**args)
      OfficeResolver.update(object, args, context)
    end
  end
end
