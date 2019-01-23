module Mutations
  class UpdateEvent < BaseMutation
    null true

    argument :input, Types::Input::EditEventInputType, required: true

    def resolve(**args)
      EventResolver.update(object, args, context)
    end
  end
end
