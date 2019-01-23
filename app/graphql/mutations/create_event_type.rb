module Mutations
  class CreateEventType < BaseMutation
    null true

    argument :input, Types::Input::EditEventTypeInputType, required: true

    def resolve(**args)
      EventTypeResolver.create(object, args, context)
    end
  end
end
