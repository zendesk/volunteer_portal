module Types::Input
  class EditEventTypeInputType < BaseInputObject
    graphql_name "EditEventTypeInputType"
    description "Create or Update an Event Type"

    argument :id, ID, required: false, description: "Provide an id to update an event type, or no id to create one"
    argument :title, String, required: true
  end
end
