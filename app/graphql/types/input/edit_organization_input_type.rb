module Types::Input
  class EditOrganizationInputType < BaseInputObject
    graphql_name "EditOrganizationInputType"
    description "Properties for creating or updating an Organization"

    argument :id, ID, required: false, description: "Provide an id to update an existing organization, or no id for creation"
    argument :name, String, required: true
    argument :description, String, required: false
    argument :location, String, required: true, description: "Normalized street address for this organization"
    argument :website, String, required: false, description: "An optional hyperlink to the organization's homepage"
  end
end
