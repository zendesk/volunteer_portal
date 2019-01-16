module EventTypeResolver
    class << self
      def create(_, args, context)
        event_type = EventType.new
        event_type.title = args['input']['title']
        event_type.save!
  
        event_type
      end
  
      def update(_, args, context)
        event_type = EventType.find_by!(title: args['input']['title']) # TODO: find by old title, and set to new title <- this should be old_title
        event_type.title = args['input']['title']
        event_type.save!
  
        event_type
      end
  
      def delete(_, args, context)
        event_type = EventType.find_by!(title: args['title'])
        event_type.destroy!
  
        event_type
      end
    end
  end
