module Mutations
  class ApproveIndividualEvents < BaseMutation
    require_admin

    description 'Mark individual events as approved'

    null true

    argument :ids, [ID], required: true

    def resolve(ids:)
      events = IndividualEvent.where(:id => ids)
      events.update_all(:status => IndividualEvent::APPROVED)
      events
    end
  end
end
