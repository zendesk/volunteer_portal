module Types::Input
  class DeleteIndividualEventInputType < BaseInputObject
    graphql_name "DeleteIndividualEventInputType"

    argument :id, ID, required: true, description: "IndividualEvent to delete"
  end
end
