module Mutations
  class CreateOffice < BaseMutation
    null true

    argument :input, Types::Input::EditOfficeInputType, required: true

    def resolve(**args)
      OfficeResolver.create(object, args, context)
    end
  end
end
