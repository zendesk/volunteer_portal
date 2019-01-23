module Types::Input
  class EditUserInputType < BaseInputObject
    graphql_name "EditUserInputType"
    description "Properties for updating a User"

    argument :id, ID, required: true
    argument :is_admin, Boolean, required: true
    argument :officeId, ID, required: true
  end
end
