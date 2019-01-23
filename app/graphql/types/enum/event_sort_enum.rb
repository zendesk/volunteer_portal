module Types::Enum
  class EventSortEnum < BaseEnum
    graphql_name 'EventSortEnum'
    description 'How to sort the resulting list of events'

    value EventResolver::STARTS_AT_DESC, 'Sort events by start time in descending order'
    value EventResolver::STARTS_AT_ASC, 'Sort events by start time in ascending order'
  end
end
