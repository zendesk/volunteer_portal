module Mutations
  class DestroySignup < BaseMutation
    description 'Destroy the given signup'

    null true

    argument :event_id, ID, required: true
    argument :user_id,  ID, required: true

    def resolve(event_id:, user_id:)
      user = context[:current_user]
      scope = user.role == Role.admin ? Signup : user.signups
      signup = scope.find_by!(event_id: event_id, user_id: user_id)
      signup.event.remove_user!(signup.user)
      signup
    end
  end
end
