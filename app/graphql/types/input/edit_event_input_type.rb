module Types::Input
  class EditEventInputType < BaseInputObject
    graphql_name "EditEventInputType"
    description "Create or Update an Event"

    argument :id, ID, required: false, description: "Provide an id to update an event, or no id to create one"
    argument :title, String, required: true
    argument :description, String, required: true
    argument :location, String, required: true
    argument :starts_at, String, required: true
    argument :ends_at, String, required: true
    argument :capacity, Int, required: true

    argument :office, AssociationInputType, required: true
    argument :event_type, AssociationInputType, required: true
    argument :organization, AssociationInputType, required: true
    argument :tags, AssociationArrayInputType, required: true
  end
end
