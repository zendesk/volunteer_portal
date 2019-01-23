module Mutations
  class UpdateOffice < BaseMutation
    null true

    argument :input, Types::Input::EditOfficeInputType, required: true

    def resolve(**args)
      OfficeResolver.update(object, args, context)
    end
  end
end
