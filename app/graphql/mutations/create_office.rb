module Mutations
  class CreateOffice < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditOfficeInputType, required: true

    def resolve(**args)
      OfficeResolver.create(object, args, context)
    end
  end
end
