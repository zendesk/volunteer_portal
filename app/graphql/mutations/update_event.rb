module Mutations
  class UpdateEvent < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditEventInputType, required: true

    def resolve(**args)
      EventResolver.update(object, args, context)
    end
  end
end
