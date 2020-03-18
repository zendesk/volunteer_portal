module Mutations
  class UpdateTag < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditTagInputType, required: true

    def resolve(**args)
      TagResolver.update(object, args, context)
    end
  end
end
