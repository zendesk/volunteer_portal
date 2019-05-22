module Mutations
  class RejectIndividualEvents < BaseMutation
    require_admin

    description 'Mark individual events as rejected'

    null true

    argument :ids, [ID], required: true

    def resolve(ids:)
      events = IndividualEvent.where(:id => ids)
      events.update_all(:status => IndividualEvent::REJECTED)
      events
    end
  end
end
