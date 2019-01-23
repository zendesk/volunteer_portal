module Types::Enum
  class OfficeSortEnum < BaseEnum
    graphql_name 'OfficeSortEnum'
    description 'How to sort the resulting list of offices'

    value OfficeResolver::NAME_DESC, 'Sort offices by name in descending order'
    value OfficeResolver::NAME_ASC, 'Sort offices by name in ascending order'
  end
end
