module Mutations
  class CreateSignup < BaseMutation
    description 'Create a signup for the current user with the given event'

    null true

    argument :event_id, ID, required: true

    def resolve(event_id:)
      event = Event.find(event_id)
      event.sign_up_user!(context[:current_user])
      event.save!
      event.signups.last
    end
  end
end
