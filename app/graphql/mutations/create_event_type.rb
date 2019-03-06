module Mutations
  class CreateEventType < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditEventTypeInputType, required: true

    def resolve(**args)
      EventTypeResolver.create(object, args, context)
    end
  end
end
