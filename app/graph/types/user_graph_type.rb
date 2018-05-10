UserGraphType = GraphQL::ObjectType.define do
  name 'User'
  description 'A user'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id,       !types.ID
  field :email,    !types.String
  field :locale,    types.String, 'A locale string provided by Google auth, e.g. "en" or "en-US"'
  field :photo,     types.String, 'Profile photo URL'
  field :group,     types.String, 'A group name this user is associated with'

  field :name do
    type types.String

    resolve -> (user, _, _) do
      "#{user.first_name} #{user.last_name}"
    end
  end

  field :timezone do
    description 'Timezone name from the [Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) e.g. "America/Los_Angeles"'
    type !types.String

    resolve -> (user, _, _) { user.timezone || ApplicationRecord::DEFAULT_TIMEZONE }
  end

  field :isAdmin do
    type types.Boolean

    resolve -> (user, _, _) do
      user.role == Role.admin
    end
  end

  field :hours do
    description 'Total number of volunteer hours. If `before` and `after` arguments are given, these hours are restricted to that range.'
    type types.Int

    argument :after,  types.Int, 'The beginning of a time range within which to return volunteer hours'
    argument :before, types.Int, 'The end of a time range within which to return volunteer hours'

    resolve -> (user, args, _) do
      Promise.all([
        EventHoursLoader.for(after: args[:after], before: args[:before]).load(user),
        IndividualEventHoursLoader.for(after: args[:after], before: args[:before]).load(user),
      ]).then { |results| results.reduce(&:+) }
    end
  end

  field :role do
    type RoleGraphType

    resolve -> (user, _, _) do
      AssociationLoader.for(User, :role).load(user)
    end
  end

  field :office do
    type OfficeGraphType

    resolve -> (user, _, _) do
      AssociationLoader.for(User, :office).load(user)
    end
  end

  field :individualEvents do
    type types[IndividualEventGraphType]

    resolve -> (user, _, _) do
      AssociationLoader.for(User, :individual_events).load(user)
    end
  end
end
