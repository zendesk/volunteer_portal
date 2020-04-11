module Types
  class OrganizationGraphType < BaseObject
    graphql_name 'Organization'
    description 'The organization that is hosting a volunteer event'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id,          ID,     null: false
    field :name,        String, null: false
    field :description, String, null: false
    field :location,    String, null: false, description: 'The street address where the organization is located. e.g. "1019 Market St, San Francisco, CA 94103, USA"'
    field :website,     String, null: true, description: 'A valid URL for the organization'

    field :hours, Int, null: true do
      description 'Total number of volunteer hours. If `before` and `after` arguments are given, these hours are restricted to that range.'

      argument :after,  Int, required: false, description: 'The beginning of a time range within which to return volunteer hours'
      argument :before, Int, required: false, description: 'The end of a time range within which to return volunteer hours'
    end
    def hours(after:, before:)
      Promise.all([
                    OrganizationHoursLoader.for(after: after, before: before).load(object),
                  ]).then { |results| results.reduce(&:+) }
    end
  end
end
