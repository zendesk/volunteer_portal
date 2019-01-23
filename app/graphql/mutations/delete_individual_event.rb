module Mutations
  class DeleteIndividualEvent < BaseMutation
    description "Create a new individual event for a logged-in user"

    null true

    argument :input, Types::Input::DeleteIndividualEventInputType, required: true

    def resolve(input:)
      IndividualEvent.destroy(input.id)
      context[:current_user]
    end
  end
end
