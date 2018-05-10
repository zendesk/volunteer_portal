OfficeGraphType = GraphQL::ObjectType.define do
  name 'Office'
  description 'An office'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id,         !types.ID
  field :name,       !types.String
  field :identifier, !types.String, 'A machine-readable version of the office name'

  field :timezone do
    description 'Timezone name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) e.g. "America/Los_Angeles"'
    type !types.String

    resolve -> (office, _, _) { office.timezone || ApplicationRecord::DEFAULT_TIMEZONE }
  end
end
