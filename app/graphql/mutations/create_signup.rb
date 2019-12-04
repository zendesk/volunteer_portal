module Mutations
  class CreateSignup < BaseMutation
    description 'Create a signup for the current user with the given event'

    null true

    argument :event_id, ID, required: true
    argument :user_email, String, required: false

    def resolve(event_id:, user_email: nil)
      event = Event.find(event_id)
      user = user_email.present? ? User.where(email: user_email).first : context[:current_user]
      event.sign_up_user!(user) if user
      event.save!
      event.signups.last
    end
  end
end
