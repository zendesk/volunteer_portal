module Mutations
  class UpdateEventType < BaseMutation
    null true

    argument :input, Types::Input::EditEventTypeInputType, required: true

    def resolve(**args)
      EventTypeResolver.update(object, args, context)
    end
  end
end
