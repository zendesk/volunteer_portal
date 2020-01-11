module Types
  class UserPreferenceGraphType < Types::BaseObject
    graphql_name 'UserPreference'
    description 'An office'

    implements GraphQL::Relay::Node.interface
    
    global_id_field :gid

    field :id, ID, null: false
    field :confirmed_profile_settings, Boolean, null: false
  end
end
