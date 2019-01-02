module EventResolver
  STARTS_AT_DESC = 'STARTS_AT_DESC'.freeze
  STARTS_AT_ASC = 'STARTS_AT_ASC'.freeze

  class << self
    def all(_, args, context)
      office_id = case args[:officeId]
      when 'all'
        nil
      when 'current'
        context[:current_user].office_id
      else
        args[:officeId]
      end

      events = Event.all
      events = events.for_office(office_id)          if office_id
      events = events.before(Time.at(args[:before])) if args[:before]
      events = events.after(Time.at(args[:after]))   if args[:after]
      events = scope_with_sort_by(events, args[:sortBy])
      events
    end

    def create(_, args, context)
      attrs = args[:input].to_h
      event = Event.new
      ActiveRecord::Base.transaction do
        update_fields(event, attrs)
        event.save!
      end
      event
    end

    def update(_, args, context)
      attrs = args[:input].to_h
      event = Event.find(attrs['id'])
      print event
      ActiveRecord::Base.transaction do
        update_fields(event, attrs)
        event.save!
      end
      event
    end

    def delete(_, args, context)
      event = Event.find(args['id'])
      event.destroy!

      event
    end

    private

    def update_fields(event, attrs)
      event.title = attrs['title']
      event.description = attrs['description']
      event.event_type_id = EventType.find_or_create_by!(title: attrs['eventType']['title']).id
      event.organization_id = attrs['organization']['id']
      event.office_id = attrs['office']['id']
      event.location = attrs['location']
      event.capacity = attrs['capacity']
      event.starts_at = Time.parse(attrs['startsAt'])
      event.ends_at = Time.parse(attrs['endsAt'])
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
