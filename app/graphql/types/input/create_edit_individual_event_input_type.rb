module Types::Input
  class CreateEditIndividualEventInputType < BaseInputObject
    graphql_name "CreateEditIndividualEventInputType"
    description "Properties for creating an Individual Event"

    argument :id, ID, required: false, description: "Provide an id for an existing event"
    argument :description, String, required: true, description: "Description of an event"
    argument :office_id, ID, required: true, description: "Office the event takes places in"
    argument :date, String, required: true, description: "Date and time the event takes place"
    argument :duration, Int, required: true, description: "Duration of event in minutes"
    argument :event_type_id, ID, required: true, description: "Type of event. ex: Mentoring"
    argument :organization_id, ID, required: true, description: "Organization with which the event is associated"
    argument :tags, [AssociationInputType], required: true, description: "Tags with which the event is associated"
  end
end
