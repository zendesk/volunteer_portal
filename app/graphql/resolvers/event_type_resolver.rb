module EventTypeResolver
  class << self
    def all
      EventType
        .all
        .where(deleted_at: nil)
        .order(:title)
    end

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
      event_type.soft_delete!(validate: false)

      event_type
    end
  end
end
