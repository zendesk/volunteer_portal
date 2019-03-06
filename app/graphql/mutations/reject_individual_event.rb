module Mutations
  class RejectIndividualEvent < BaseMutation
    require_admin

    description 'Mark an individual event as rejected'

    null true

    argument :id, ID, required: true

    def resolve(id:)
      event = IndividualEvent.find(id)
      event.status = IndividualEvent::REJECTED
      event.save!
      event
    end
  end
end
