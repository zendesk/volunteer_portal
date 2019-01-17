module Types::Enum
  class IndividualEventStatusEnum < BaseEnum
    graphql_name 'Status'
    description 'The statuses for an Individual Event'

    value 'REJECTED', 'Not Approved', value: IndividualEvent::REJECTED
    value 'PENDING', 'Approval is pending', value: IndividualEvent::PENDING
    value 'APPROVED', 'Approved', value: IndividualEvent::APPROVED
  end
end
