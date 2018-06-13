module EventResolver
  class << self
    def create(_, args, context)
      attrs = args[:input].to_h

      event = Event.new
      update_fields(event, attrs)
      event.save!

      event
    end

    def update(_, args, context)
      attrs = args[:input].to_h

      event = Event.find(attrs['id'])
      update_fields(event, attrs)
      event.save!

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
      event.event_type_id = attrs['eventType']['id']
      event.organization_id = attrs['organization']['id']
      event.office_id = attrs['office']['id']
      event.location = attrs['location']
      event.capacity = attrs['capacity']
      event.starts_at = Time.parse(attrs['startsAt'])
      event.ends_at = Time.parse(attrs['endsAt'])
    end
  end
end
