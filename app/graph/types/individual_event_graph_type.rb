IndividualEventStatusEnum = GraphQL::EnumType.define do
  name 'Status'
  description 'The statuses for an Individual Event'

  value 'REJECTED', 'Not Approved', value: IndividualEvent::REJECTED
  value 'PENDING', 'Approval is pending', value: IndividualEvent::PENDING
  value 'APPROVED', 'Approved', value: IndividualEvent::APPROVED
end

IndividualEventGraphType = GraphQL::ObjectType.define do
  name 'IndividualEvent'
  description 'An individual event'

  implements GraphQL::Relay::Node.interface

  global_id_field :gid

  #### Properties
  field :id,          !types.ID
  field :description, !types.String
  field :date,        !types.String, 'Date of the event in ISO 8601 format: `YYYY-MM-DD` e.g. "2017-11-30"'
  field :duration,    !types.Int,    'Duration of the event in minutes'
  field :status,      !IndividualEventStatusEnum


  #### Associations
  field :user do
    type UserGraphType

    resolve -> (ie, _, _) do
      AssociationLoader.for(IndividualEvent, :user).load(ie)
    end
  end

  field :organization do
    type OrganizationGraphType

    resolve -> (ie, _, _) do
      AssociationLoader.for(IndividualEvent, :organization).load(ie)
    end
  end

  field :eventType do
    type EventTypeGraphType

    resolve -> (ie, _, _) do
      AssociationLoader.for(IndividualEvent, :event_type).load(ie)
    end
  end

  field :office do
    type OfficeGraphType

    resolve -> (ie, _, _) do
      AssociationLoader.for(IndividualEvent, :office).load(ie)
    end
  end
end
