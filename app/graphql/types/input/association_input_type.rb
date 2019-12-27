module Types::Input
  class AssociationInputType < BaseInputObject
    graphql_name 'AssociationInputType'
    description <<~STR
      A generic association input type. This is useful when you want to create objects
      and only specify the ID of an association.
    STR

    argument :id, ID, required: true
  end
  class AssociationArrayInputType < BaseInputObject
    graphql_name 'AssociationArrayInputType'
    description <<~STR
      A generic association input type. This is useful when you want to create objects
      and only specify array of IDs of an association.
    STR

    argument :ids, [ID], required: true
  end
end
