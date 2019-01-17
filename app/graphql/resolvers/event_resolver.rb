module EventResolver
  STARTS_AT_DESC = 'STARTS_AT_DESC'.freeze
  STARTS_AT_ASC = 'STARTS_AT_ASC'.freeze

  class << self
    def all(_, args, context)
      office_id = case args[:office_id]
      when 'all'
        nil
      when 'current'
        context[:current_user].office_id
      else
        args[:office_id]
      end

      events = Event.all
      events = events.for_office(office_id)          if office_id
      events = events.before(Time.at(args[:before])) if args[:before]
      events = events.after(Time.at(args[:after]))   if args[:after]
      events = scope_with_sort_by(events, args[:sort_by])
      events
    end

    def create(_, args, context)
      event = Event.new
      update_fields(event, args[:input])
      event.save!

      event
    end

    def update(_, args, context)
      input = args[:input]

      event = Event.find(input.id)
      update_fields(event, input)
      event.save!

      event
    end

    def delete(_, args, context)
      event = Event.find(args[:id])
      event.destroy!

      event
    end

    private

    def update_fields(event, input)
      event.title = input.title
      event.description = input.description
      event.event_type_id = input.event_type.id
      event.organization_id = input.organization.id
      event.office_id = input.office.id
      event.location = input.location
      event.capacity = input.capacity
      event.starts_at = Time.parse(input.starts_at)
      event.ends_at = Time.parse(input.ends_at)
    end

    def scope_with_sort_by(scope, sort_by)
      return scope if sort_by.nil?
      query_string = case sort_by
      when STARTS_AT_DESC
        'starts_at DESC'
      when STARTS_AT_ASC
        'starts_at ASC'
      end
      scope.order(query_string)
    end
  end
end
