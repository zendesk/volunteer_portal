module Mutations
  class UpdateUser < BaseMutation
    null true

    argument :input, Types::Input::EditUserInputType, required: true

    def resolve(**args)
      UserResolver.update(object, args, context)
    end
  end
end
