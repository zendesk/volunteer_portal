module Types::Enum
  class UserSortEnum < BaseEnum
    graphql_name 'UserSortEnum'
    description 'How to sort the resulting list of users'

    value UserResolver::HOURS_DESC, 'Sort users by volunteering hours in descending order'
    value UserResolver::HOURS_ASC, 'Sort users by volunteering hours in ascending order'
  end
end
