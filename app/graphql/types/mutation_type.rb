module Types
  class MutationType < Types::BaseObject
    graphql_name "Mutation"

    field :create_signup, SignupGraphType, null: true do
      description 'Create a signup for the current user with the given event'

      argument :event_id, ID, required: true
    end
    def create_signup(event_id:)
      event = Event.find(event_id)
      event.sign_up_user!(context[:current_user])
      event.save!
      event.signups.last
    end

    field :destroy_signup, SignupGraphType, null: true do
      description 'Destroy the given signup'

      argument :event_id, ID, required: true
      argument :user_id,  ID, required: true
    end
    def destroy_signup(event_id:, user_id:)
      user = context[:current_user]
      scope = user.role == Role.admin ? Signup : user.signups
      signup = scope.find_by!(event_id: event_id, user_id: user_id)
      signup.event.remove_user!(signup.user)
      signup
    end

    field :update_user_office, UserGraphType, null: true do
      description 'Update the office of the current user object'

      argument :user_id,   ID, required: true
      argument :office_id, ID, required: true
    end
    def update_user_office(user_id:, office_id:)
      user = User.find(user_id)
      office = Office.find(office_id)
      user.office = office
      user.save!
      user
    end

    field :create_edit_individual_event, UserGraphType, null: true do
      description "Create a new individual event for a logged-in user"

      argument :input, Input::CreateEditIndividualEventInputType, required: true
    end
    def create_edit_individual_event(input:)
      if input.id
        IndividualEvent.find(input.id)
      else
        IndividualEvent.new
      end.tap do |individual_event|
        individual_event.description = input.description
        individual_event.office_id = input.office_id
        individual_event.user = context[:current_user]
        individual_event.date = Time.at(input.date)
        individual_event.duration = input.duration
        individual_event.event_type_id = input.event_type_id
        individual_event.organization_id = input.organization_id
        individual_event.save!
      end

      context[:current_user]
    end

    field :delete_individual_event, UserGraphType, null: true do
      description "Create a new individual event for a logged-in user"

      argument :input, Input::DeleteIndividualEventInputType, required: true
    end
    def delete_individual_event(input:)
      IndividualEvent.destroy(input.id)
      context[:current_user]
    end

    field :approve_individual_event, IndividualEventGraphType, null: true do
      description 'Mark an individual event as approved'

      argument :id, ID, required: true
    end
    def approve_individual_event(id:)
      event = IndividualEvent.find(id)
      event.status = IndividualEvent::APPROVED
      event.save!
      event
    end

    field :reject_individual_event, IndividualEventGraphType, null: true do
      description 'Mark an individual event as rejected'

      argument :id, ID, required: true
    end
    def reject_individual_event(id:)
      event = IndividualEvent.find(id)
      event.status = IndividualEvent::REJECTED
      event.save!
      event
    end

    field :create_office, OfficeGraphType, null: true do
      argument :input, Input::EditOfficeInputType, required: true
    end
    def create_office(**args)
      OfficeResolver.create(object, args, context)
    end

    field :update_office, OfficeGraphType, null: true do
      argument :input, Input::EditOfficeInputType, required: true
    end
    def update_office(**args)
      OfficeResolver.update(object, args, context)
    end

    field :delete_office, OfficeGraphType, null: true do
      argument :id, ID, required: true
    end
    def delete_office(**args)
      OfficeResolver.delete(object, args, context)
    end

    field :create_organization, OrganizationGraphType, null: true do
      argument :input, Input::EditOrganizationInputType, required: true
    end
    def create_organization(**args)
      OrganizationResolver.create(object, args, context)
    end

    field :update_organization, OrganizationGraphType, null: true do
      argument :input, Input::EditOrganizationInputType, required: true
    end
    def update_organization(**args)
      OrganizationResolver.update(object, args, context)
    end

    field :delete_organization, OrganizationGraphType, null: true do
      argument :id, ID, required: true
    end
    def delete_organization(**args)
      OrganizationResolver.delete(object, args, context)
    end

    field :update_user, UserGraphType, null: true do
      argument :input, Input::EditUserInputType, required: true
    end
    def update_user(**args)
      UserResolver.update(object, args, context)
    end

    field :delete_user, UserGraphType, null: true do
      argument :id, ID, required: true
    end
    def delete_user(**args)
      UserResolver.delete(object, args, context)
    end

    field :create_event, EventGraphType, null: true do
      argument :input, Input::EditEventInputType, required: true
    end
    def create_event(**args)
      EventResolver.create(object, args, context)
    end

    field :update_event, EventGraphType, null: true do
      argument :input, Input::EditEventInputType, required: true
    end
    def update_event(**args)
      EventResolver.update(object, args, context)
    end

    field :delete_event, EventGraphType, null: true do
      argument :id, ID, required: true
    end
    def delete_event(**args)
      EventResolver.delete(object, args, context)
    end

    field :create_event_type, EventTypeGraphType, null: true do
      argument :input, Input::EditEventTypeInputType, required: true
    end
    def create_event_type(**args)
      EventTypeResolver.create(object, args, context)
    end

    field :update_event_type, EventTypeGraphType, null: true do
      argument :input, Input::EditEventTypeInputType, required: true
    end
    def update_event_type(**args)
      EventTypeResolver.update(object, args, context)
    end

    field :delete_event_type, EventTypeGraphType, null: true do
      argument :id, ID, required: true
    end
    def delete_event_type(**args)
      EventTypeResolver.delete(object, args, context)
    end
  end
end
