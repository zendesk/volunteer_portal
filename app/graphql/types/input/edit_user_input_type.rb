module Types::Input
  class EditUserInputType < BaseInputObject
    graphql_name "EditUserInputType"
    description "Properties for updating a User"

    argument :id, ID, required: true
    argument :is_admin, Boolean, required: true
    argument :office_id, ID, required: true
  end
end
