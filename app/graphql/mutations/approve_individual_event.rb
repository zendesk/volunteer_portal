module Mutations
  class ApproveIndividualEvent < BaseMutation
    description 'Mark an individual event as approved'

    null true

    argument :id, ID, required: true

    def resolve(id:)
      event = IndividualEvent.find(id)
      event.status = IndividualEvent::APPROVED
      event.save!
      event
    end
  end
end
