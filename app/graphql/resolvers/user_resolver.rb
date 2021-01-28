module UserResolver
  HOURS_DESC = 'HOURS_DESC'.freeze
  HOURS_ASC = 'HOURS_ASC'.freeze

  class << self
    def all(_object, args, context)
      scope = User.all

      office_id = case args[:office_id]
                  when 'all'
                    nil
                  when 'current'
                    context[:current_user].office_id
                  else
                    args[:office_id]
                  end

      scope = scope_with_time(scope, args[:after], args[:before])
      scope = scope_with_office_id(scope, office_id)
      scope = scope_with_count(scope, args[:count])
      scope_with_sort_by(scope, args[:sort_by])
    end

    def update(_, args, context)
      input = args[:input]
      user = User.find(input.id)

      if context[:current_user].role == Role.admin
        user.role_id = input.is_admin ? Role.admin.id : Role.volunteer.id
        user.office_id = input.office_id
      elsif context[:current_user].id.to_s == input.id.to_s
        user.office_id = input.office_id
      end

      user.save!

      user
    end

    def delete(_, args, _context)
      user = User.find(args[:id])
      user.destroy!

      user
    end

    private

    BASE_INDIVIDUAL_EVENTS_JOIN = 'LEFT JOIN "individual_events" ON "individual_events"."user_id" = "users"."id"'.freeze

    def scope_with_time(scope, after, before)
      return scope unless after || before

      scope = scope.joins(:events)
      individual_events_join = BASE_INDIVIDUAL_EVENTS_JOIN.dup

      if after
        scope = scope.where('"events"."starts_at" > ?', Time.zone.at(after))
        individual_events_join << %( AND "individual_events"."date" > '#{Time.zone.at(after).to_date.to_s(:db)}')
      end

      if before
        scope = scope.where('"events"."starts_at" < ?', Time.zone.at(before))
        individual_events_join << %( AND "individual_events"."date" < '#{Time.zone.at(before).to_date.to_s(:db)}')
      end

      scope.joins(individual_events_join)
    end

    def scope_with_office_id(scope, office_id)
      return scope unless office_id

      scope.where(office_id: office_id)
    end

    def scope_with_count(scope, count)
      return scope unless count

      scope.limit(count)
    end

    def scope_with_sort_by(scope, sort_by)
      return scope unless sort_by

      query = <<-SQL
        (
          SUM(
            (EXTRACT(EPOCH FROM "events"."ends_at") - EXTRACT(EPOCH FROM "events"."starts_at")) / 60
          )
          +
          SUM(
            COALESCE("individual_events"."duration", 0)
          )
        )
      SQL

      order = case sort_by
              when HOURS_DESC
                "#{query} DESC"
              when HOURS_ASC
                "#{query} ASC"
              end

      scope = scope.joins(BASE_INDIVIDUAL_EVENTS_JOIN) unless scope.to_sql.include?('LEFT JOIN "individual_events"')

      scope
        .joins(:events)
        .group(:id)
        .order(order)
    end
  end
end
