module Types::Input
  class EditTagInputType < BaseInputObject
    graphql_name "EditTagInputType"
    description "Create or Update a Tag"

    argument :id, ID, required: false, description: "Provide an id to update a tag, or no id to create one"
    argument :name, String, required: true
  end
end
