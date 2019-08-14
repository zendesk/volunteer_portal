module TopVolunteerResolver
  class << self
    def alL(_object, args, context)
      events_scope = User.joins(:events).select('users.id, events.duration')
      individual_events_scope = User.joins(:individual_events).select('users.id, individual_events.duration')

      office_id = case args[:office_id]
                  when 'all'
                    nil
                  when 'current'
                    context[:current_user].office_id
                  else
                    args[:office_id]
                  end

      events_scope, individual_events_scope = scope_with_time(events_scope, individual_events_scope, args[:after], args[:before])
    end

    private

    def scope_with_time(events_scope, individual_events_scope, after, before)
      return events_scope, individual_events_scope unless after || before

      if after
        events_scope = events_scope.where('"events"."starts_at" > ?', Time.at(after))
        individual_events_scope = individual_events_scope.where('"individual_events"."date" > ?', Time.at(after))
      end

      if before
        events_scope = events_scope.where('"events"."starts_at" < ?', Time.at(after))
        individual_events_scope = individual_events_scope.where('"individual_events"."date" < ?', Time.at(after))
      end

      return events_scope, individual_events_scope
    end
  end
end
