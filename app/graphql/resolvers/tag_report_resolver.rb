module TagReportResolver
  # Note: These queries have been taken from official Dataclips we've been using since 2019.
  # TODO: Refactor into Active Record Queries to make it testable.
  class << self
    def individual(_object, args, _context)
      office_id = args[:office_id]
      # Disabling TimeZone check for rubocop here because the frontend handles the timezone
      # rubocop:disable Rails/TimeZone
      sql = "
      SELECT \"id\", \"name\", \"sum\" from tags INNER JOIN
        (SELECT SUM(duration), tag_id
        from individual_events INNER JOIN individual_event_tags ON individual_events.id=individual_event_tags.individual_event_id
        WHERE \"individual_events\".\"deleted_at\" IS NULL
        #{office_id == 'all' ? '' : "AND individual_events.office_id=#{office_id}"}
        AND \"individual_events\".\"status\" = 1
        AND (date > '#{Time.at(args[:after])}')
        AND (date < '#{Time.at(args[:before])}')
        GROUP BY tag_id) as tagDuration
      ON tagDuration.tag_id=tags.id
      "
      # rubocop:enable Rails/TimeZone
      records_array = ActiveRecord::Base.connection.execute(sql)
      result = records_array.map do |record|
        {
          id: record["id"],
          name: record["name"],
          minutes: record["sum"]
        }
      end
      result
    end

    def organized(_object, args, _context)
      office_id = args[:office_id]
      # rubocop:disable Rails/TimeZone
      sql = "
      SELECT \"id\", \"name\", \"sum\" from tags INNER JOIN
        (SELECT SUM(duration), tag_id
        from events LEFT JOIN event_tags ON (events.id=event_tags.event_id) LEFT JOIN signups ON signups.event_id = events.id
        WHERE \"events\".\"deleted_at\" IS NULL 
        #{office_id == 'all' ? '' : "AND events.office_id=#{office_id}"}
        AND (starts_at > '#{Time.at(args[:after])}')
        AND (starts_at < '#{Time.at(args[:before])}')
        GROUP BY tag_id) as tagDuration
      ON tagDuration.tag_id=tags.id
      "
      # rubocop:enable Rails/TimeZone

      records_array = ActiveRecord::Base.connection.execute(sql)
      result = records_array.map do |record|
        {
          id: record["id"],
          name: record["name"],
          minutes: record["sum"]
        }
      end
      result
    end
  end
end
