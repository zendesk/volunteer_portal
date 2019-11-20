# VolunteerResolver is essentially a near duplicate of the UserResolver, but will
# report the total hours without inflating the number of hours due to joining
# 2 tables. This will fix the incorrect ordering in the Top Volunteers
# Dashboard.
#
# It was initially decided to implement this in a seperate resolver as it would
# take too much effort to make sure that the changes do not break in other
# places. Ideally this should be refactored into the UserResolver over time.
module VolunteerResolver
  class << self
    def all(_object, args, context)
      user_entry = '"users"."id", "users"."first_name", "users"."last_name", "users"."email", "users"."group", "users"."photo"'

      events_scope = User.joins(:events).select("#{user_entry}, \"events\".\"duration\"")
      individual_events_scope = User.joins(:individual_events).select("#{user_entry}, \"individual_events\".\"duration\"")

      office_id = case args[:office_id]
                  when 'all'
                    nil
                  when 'current'
                    context[:current_user].office_id
                  else
                    args[:office_id]
                  end

      events_scope, individual_events_scope = scope_with_time(events_scope, individual_events_scope, args[:after], args[:before])
      events_scope, individual_events_scope = scope_with_office_id(events_scope, individual_events_scope, office_id)

      all_events_scope = events_scope.union_all(individual_events_scope)
      all_events_scope = all_events_scope.select("#{user_entry},  SUM(\"duration\") AS \"duration\"").group(user_entry)

      all_events_scope = scope_with_count(all_events_scope, args[:count])
      all_events_scope = scope_with_sort_by(all_events_scope, args[:sort_by])

      all_events_scope
    end

    private

    def scope_with_time(events_scope, individual_events_scope, after, before)
      return events_scope, individual_events_scope unless after || before

      # Disabling TimeZone check for rubocop here because the frontend handles the timezone
      # rubocop:disable Rails/TimeZone
      if after
        events_scope = events_scope.where('"events"."starts_at" > ?', Time.at(after))
        individual_events_scope = individual_events_scope.where('"individual_events"."date" > ?', Time.at(after))
      end

      if before
        events_scope = events_scope.where('"events"."starts_at" < ?', Time.at(before))
        individual_events_scope = individual_events_scope.where('"individual_events"."date" < ?', Time.at(before))
      end
      # rubocop:enable Rails/TimeZone

      [events_scope, individual_events_scope]
    end

    def scope_with_office_id(events_scope, individual_events_scope, office_id)
      return events_scope, individual_events_scope unless office_id

      events_scope = events_scope.where(office_id: office_id)
      individual_events_scope = individual_events_scope.where(office_id: office_id)

      [events_scope, individual_events_scope]
    end

    def scope_with_count(scope, count)
      return scope unless count

      scope.limit(count)
    end

    def scope_with_sort_by(scope, sort_by)
      return scope unless sort_by

      order = case sort_by
              when UserResolver::HOURS_DESC
                '"duration" DESC'
              when UserResolver::HOURS_ASC
                '"duration" ASC'
              end

      scope.order(order)
    end
  end
end
