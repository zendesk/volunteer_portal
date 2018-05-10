SignupGraphType = GraphQL::ObjectType.define do
  name 'Signup'
  description 'A signup'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  field :id, !types.ID

  field :user do
    type UserGraphType

    resolve -> (signup, _, _) do
      AssociationLoader.for(Signup, :user).load(signup)
    end
  end

  field :event do
    type EventGraphType

    resolve -> (signup, _, _) do
      AssociationLoader.for(Signup, :event).load(signup)
    end
  end
end
