module Mutations
  class CreateEditIndividualEvent < BaseMutation
    description "Create a new individual event for a logged-in user"

    null true

    argument :input, Types::Input::CreateEditIndividualEventInputType, required: true

    def resolve(input:)
      if input.id
        IndividualEvent.find(input.id)
      else
        IndividualEvent.new
      end.tap do |individual_event|
        individual_event.description = input.description
        individual_event.office_id = input.office_id
        individual_event.user = context[:current_user]
        individual_event.date = Date.parse(input.date)
        individual_event.duration = input.duration
        individual_event.event_type_id = input.event_type_id
        individual_event.organization_id = input.organization_id

        tags = input[:tags]
        tags.each do |tag|
          my_tag = Tag.find(tag[:id])
          individual_event.assign_tags(my_tag)
        end

        individual_event.save!
      end

      context[:current_user]
    end
  end
end
