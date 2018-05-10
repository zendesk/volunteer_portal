MutationGraphType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createSignup, SignupGraphType do
    description 'Create a signup for the current user with the given event'

    argument :eventId, !types.ID

    resolve -> (_, args, context) do
      event = Event.find(args[:eventId])
      event.sign_up_user!(context[:current_user])
      event.save!
      event.signups.last
    end
  end

  field :destroySignup, SignupGraphType do
    description 'Destroy the given signup'

    argument :eventId, !types.ID
    argument :userId,  !types.ID

    resolve -> (_, args, _) do
      signup = Signup.find_by!(event_id: args[:eventId], user_id: args[:userId])
      signup.event.remove_user!(signup.user)
      signup
    end
  end

  field :updateUserOffice, UserGraphType do
    description 'Update the office of the current user object'

    argument :userId,   !types.ID
    argument :officeId, !types.ID

    resolve -> (_, args, _) do
      user = User.find(args[:userId])
      office = Office.find(args[:officeId])
      user.office = office
      user.save!
      user
    end
  end

  field :createEditIndividualEvent, UserGraphType do
    description "Create a new individual event for a logged-in user"

    argument :input, !CreateEditIndividualEventInputType

    resolve -> (_, args, context) do
      user = context[:current_user]
      attrs = args[:input].to_h

      ie = if attrs["id"]
        IndividualEvent.find(attrs["id"])
      else
        IndividualEvent.new
      end

      ie.description = attrs["description"]
      ie.office_id = attrs["officeId"]
      ie.user = user
      ie.date = Time.at(attrs["date"])
      ie.duration = attrs["duration"]
      ie.event_type_id = attrs["eventTypeId"]
      ie.organization_id = attrs["organizationId"]
      ie.save!

      user
    end
  end

  field :deleteIndividualEvent, UserGraphType do
    description "Create a new individual event for a logged-in user"

    argument :input, !DeleteIndividualEventInputType

    resolve -> (_, args, context) do
      eventToDelete = args[:input][:id]

      IndividualEvent.destroy(eventToDelete)
      context[:current_user]
    end
  end

  field :approveIndividualEvent, IndividualEventGraphType do
    description 'Mark an individual event as approved'

    argument :id, !types.ID

    resolve -> (_, args, _) do
      event = IndividualEvent.find(args[:id])
      event.status = IndividualEvent::APPROVED
      event.save!
      event
    end
  end

  field :rejectIndividualEvent, IndividualEventGraphType do
    description 'Mark an individual event as rejected'

    argument :id, !types.ID

    resolve -> (_, args, _) do
      event = IndividualEvent.find(args[:id])
      event.status = IndividualEvent::REJECTED
      event.save!
      event
    end
  end

  field :createOffice, OfficeGraphType do
    argument :input, EditOfficeInputType
    resolve OfficeResolver.method(:create)
  end

  field :updateOffice, OfficeGraphType do
    argument :input, EditOfficeInputType
    resolve OfficeResolver.method(:update)
  end

  field :deleteOffice, OfficeGraphType do
    argument :id, !types.ID
    resolve OfficeResolver.method(:delete)
  end

  field :createOrganization, OrganizationGraphType do
    argument :input, EditOrganizationInputType
    resolve OrganizationResolver.method(:create)
  end

  field :updateOrganization, OrganizationGraphType do
    argument :input, EditOrganizationInputType
    resolve OrganizationResolver.method(:update)
  end

  field :deleteOrganization, OrganizationGraphType do
    argument :id, !types.ID
    resolve OrganizationResolver.method(:delete)
  end

  field :updateUser, UserGraphType do
    argument :input, EditUserInputType
    resolve UserResolver.method(:update)
  end

  field :deleteUser, UserGraphType do
    argument :id, !types.ID
    resolve UserResolver.method(:delete)
  end

  field :createEvent, EventGraphType do
    argument :input, EditEventInputType
    resolve EventResolver.method(:create)
  end

  field :updateEvent, EventGraphType do
    argument :input, EditEventInputType
    resolve EventResolver.method(:update)
  end

  field :createEventType, EventTypeGraphType do
    argument :input, EditEventTypeInputType
    resolve EventTypeResolver.method(:create)
  end

  field :updateEventType, EventTypeGraphType do
    argument :input, EditEventTypeInputType
    resolve EventTypeResolver.method(:update)
  end

  field :deleteEventType, EventTypeGraphType do
    argument :id, !types.ID
    resolve EventTypeResolver.method(:delete)
  end
end

CreateEditIndividualEventInputType = GraphQL::InputObjectType.define do
  name "CreateEditIndividualEventInputType"
  description "Properties for creating an Individual Event"

  argument :id, types.ID, "Provide an id for an existing event"
  argument :description, !types.String, "Description of an event"
  argument :officeId, !types.ID, "Office the event takes places in"
  argument :date, !types.Int, "Date and time the event takes place"
  argument :duration, !types.Int, "Duration of event in minutes"
  argument :eventTypeId, !types.ID, "Type of event. ex: Mentoring"
  argument :organizationId, !types.ID, "Organization with which the event is associated"
end

DeleteIndividualEventInputType = GraphQL::InputObjectType.define do
  name "DeleteIndividualEventInputType"

  argument :id, !types.ID, "IndividualEvent to delete"
end

AssociationInputType = GraphQL::InputObjectType.define do
  name 'AssociationInputType'
  description <<~STR
  A generic association input type. This is useful when you want to create objects
  and only specify the ID of an association.
  STR

  argument :id, !types.ID
end

EditOfficeInputType = GraphQL::InputObjectType.define do
  name "EditOfficeInputType"
  description "Properties for creating or updating an Office"

  argument :id, types.ID, "Provide an id to update an existing office, or no id for creation"
  argument :name, !types.String
  argument :timezone, !types.String, "Timezone most events associated with this office happen in"
end

EditOrganizationInputType = GraphQL::InputObjectType.define do
  name "EditOrganizationInputType"
  description "Properties for creating or updating an Organization"

  argument :id, types.ID, "Provide an id to update an existing organization, or no id for creation"
  argument :name, !types.String
  argument :description, types.String
  argument :location, !types.String, "Normalized street address for this organization"
  argument :website, types.String, "An optional hyperlink to the organization's homepage"
end

EditUserInputType = GraphQL::InputObjectType.define do
  name "EditUserInputType"
  description "Properties for updating a User"

  argument :id, !types.ID
  argument :isAdmin, !types.Boolean
  argument :officeId, !types.ID
end

EditEventInputType = GraphQL::InputObjectType.define do
  name "EditEventInputType"
  description "Create or Update an Event"

  argument :id, types.ID, "Provide an id to update an event, or no id to create one"
  argument :title, !types.String
  argument :description, !types.String
  argument :location, !types.String
  argument :startsAt, !types.String
  argument :endsAt, !types.String
  argument :capacity, !types.Int

  input_field :office, AssociationInputType
  input_field :eventType, AssociationInputType
  input_field :organization, AssociationInputType
end

EditEventTypeInputType = GraphQL::InputObjectType.define do
  name "EditEventTypeInputType"
  description "Create or Update an Event Type"

  argument :id, types.ID, "Provide an id to update an event type, or no id to create one"
  argument :title, !types.String
end
