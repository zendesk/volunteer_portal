module EventTypeResolver
  class << self
    def create(_, args, _context)
      event_type = EventType.new
      event_type.title = args[:input].title
      event_type.save!

      event_type
    end

    def update(_, args, _context)
      event_type = EventType.find(args[:input].id)
      event_type.title = args[:input].title
      event_type.save!

      event_type
    end

    def delete(_, args, _context)
      event_type = EventType.find(args[:id])
      event_type.destroy!

      event_type
    end
  end
end
