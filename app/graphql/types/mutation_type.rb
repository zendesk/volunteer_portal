module Types
  class MutationType < Types::BaseObject
    graphql_name "Mutation"

    field :create_signup, SignupGraphType, mutation: Mutations::CreateSignup
    field :destroy_signup, SignupGraphType, mutation: Mutations::DestroySignup

    field :update_user_office, UserGraphType, mutation: Mutations::UpdateUserOffice

    field :create_edit_individual_event, UserGraphType, mutation: Mutations::CreateEditIndividualEvent
    field :delete_individual_event, UserGraphType, mutation: Mutations::DeleteIndividualEvent
    field :approve_individual_events, [IndividualEventGraphType], mutation: Mutations::ApproveIndividualEvents
    field :reject_individual_events, [IndividualEventGraphType], mutation: Mutations::RejectIndividualEvents

    field :create_office, OfficeGraphType, mutation: Mutations::CreateOffice
    field :update_office, OfficeGraphType, mutation: Mutations::UpdateOffice
    field :delete_office, OfficeGraphType, mutation: Mutations::DeleteOffice

    field :create_organization, OrganizationGraphType, mutation: Mutations::CreateOrganization
    field :update_organization, OrganizationGraphType, mutation: Mutations::UpdateOrganization
    field :delete_organization, OrganizationGraphType, mutation: Mutations::DeleteOrganization

    field :update_user, UserGraphType, mutation: Mutations::UpdateUser
    field :delete_user, UserGraphType, mutation: Mutations::DeleteUser

    field :create_event, EventGraphType, mutation: Mutations::CreateEvent
    field :update_event, EventGraphType, mutation: Mutations::UpdateEvent
    field :delete_event, EventGraphType, mutation: Mutations::DeleteEvent

    field :create_event_type, EventTypeGraphType, mutation: Mutations::CreateEventType
    field :update_event_type, EventTypeGraphType, mutation: Mutations::UpdateEventType
    field :delete_event_type, EventTypeGraphType, mutation: Mutations::DeleteEventType
  end
end
