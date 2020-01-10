module Mutations
  class DeleteIndividualEvent < BaseMutation
    description "Create a new individual event for a logged-in user"

    null true

    argument :input, Types::Input::DeleteIndividualEventInputType, required: true

    def resolve(input:)
      IndividualEvent
        .find(input.id)
        .soft_delete!(validate: false)
      context[:current_user]
    end
  end
end
