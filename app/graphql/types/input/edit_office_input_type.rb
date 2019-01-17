module Types::Input
  class EditOfficeInputType < BaseInputObject
    graphql_name "EditOfficeInputType"
    description "Properties for creating or updating an Office"

    argument :id, ID, required: false, description: "Provide an id to update an existing office, or no id for creation"
    argument :name, String, required: true
    argument :timezone, String, required: true, description: "Timezone most events associated with this office happen in"
  end
end
