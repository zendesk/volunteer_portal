module EventTypeReportResolver
  # Note: These queries have been taken from official Dataclips we've been using since 2019.
  # TODO: Refactor into Active Record Queries to make it testable.
  class << self
    def individual(_object, args, _context)
      office_id = args[:office_id]
      # We use UTC as the reports should be consistent for all admins regardless of time zones.
      sql = "
      SELECT \"id\", \"title\", \"sum\" from event_types INNER JOIN
        (SELECT SUM(duration), event_type_id
        from individual_events INNER JOIN event_types ON individual_events.event_type_id=event_types.id
        WHERE \"individual_events\".\"deleted_at\" IS NULL
        #{office_id == 'all' ? '' : "AND individual_events.office_id=#{office_id}"}
        AND \"individual_events\".\"status\" = 1
        AND (date > '#{Time.at(args[:after]).utc}')
        AND (date < '#{Time.at(args[:before]).utc}')
        GROUP BY event_type_id) as eventDuration
      ON eventDuration.event_type_id=event_types.id"

      records_array = ActiveRecord::Base.connection.execute(sql)
      result = records_array.map do |record|
        {
          id: record["id"],
          title: record["title"],
          minutes: record["sum"]
        }
      end
      result
    end

    def organized(_object, args, _context)
      office_id = args[:office_id]
      sql = "
      SELECT \"id\", \"title\", \"sum\" from event_types INNER JOIN
        (SELECT SUM(duration), event_type_id
        from events LEFT JOIN event_types ON (events.event_type_id=event_types.id) LEFT JOIN signups ON signups.event_id = events.id
        WHERE \"events\".\"deleted_at\" IS NULL
        #{office_id == 'all' ? '' : "AND events.office_id=#{office_id}"}
        AND (starts_at > '#{Time.at(args[:after]).utc}')
        AND (starts_at < '#{Time.at(args[:before]).utc}')
        GROUP BY event_type_id) as eventDuration
      ON event_types.id=eventDuration.event_type_id"

      records_array = ActiveRecord::Base.connection.execute(sql)
      result = records_array.map do |record|
        {
          id: record["id"],
          title: record["title"],
          minutes: record["sum"]
        }
      end
      result
    end
  end
end
