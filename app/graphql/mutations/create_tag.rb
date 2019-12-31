module Mutations
  class CreateTag < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditTagInputType, required: true

    def resolve(**args)
      TagResolver.create(object, args, context)
    end
  end
end
