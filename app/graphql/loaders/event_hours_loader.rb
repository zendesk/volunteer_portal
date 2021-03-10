class EventHoursLoader < GraphQL::Batch::Loader
  def initialize(after: nil, before: nil)
    super()
    @after = after
    @before = before
  end

  def load(user)
    super(user.id)
  end

  def perform(user_ids)
    query(user_ids).each do |(user_id, duration)|
      hours = (duration / 60.0).round
      fulfill(user_id, hours)
    end

    # This is the fallback case to ensure we resolve the promise and return a
    # result for every user. `fullfilled?` will only return false if the block
    # above doesn't find and resolve for one of the `user_ids`.
    user_ids.each { |id| fulfill(id, 0) unless fulfilled?(id) }
  end

  private

  def query(user_ids)
    scope = Event.joins(:signups)
    scope = scope.after(Time.zone.at(@after)) if @after
    scope = scope.before(Time.zone.at(@before)) if @before

    scope
      .where(signups: { user_id: user_ids })
      .group('"signups"."user_id"')
      .pluck('"signups"."user_id"', 'SUM((EXTRACT(EPOCH FROM "events"."ends_at") - EXTRACT(EPOCH FROM "events"."starts_at")) / 60)')
  end
end
