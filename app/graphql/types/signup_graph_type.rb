module Types
  class SignupGraphType < BaseObject
    graphql_name 'Signup'
    description 'A signup'

    implements GraphQL::Relay::Node.interface

    global_id_field :gid

    field :id, ID, null: false

    field :user, UserGraphType, null: false
    def user
      AssociationLoader.for(Signup, :user).load(object)
    end

    field :event, EventGraphType, null: false
    def event
      AssociationLoader.for(Signup, :event).load(object)
    end
  end
end
