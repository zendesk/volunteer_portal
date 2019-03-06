module Mutations
  class CreateEvent < BaseMutation
    require_admin

    null true

    argument :input, Types::Input::EditEventInputType, required: true

    def resolve(**args)
      EventResolver.create(object, args, context)
    end
  end
end
