class SignupCountLoader < GraphQL::Batch::Loader
  def load(event)
    super(event.id)
  end

  def perform(event_ids)
    query(event_ids).each { |(event_id, count)| fulfill(event_id, count) }
    event_ids.each { |event_id| fulfill(event_id, 0) unless fulfilled?(event_id) }
  end

  private

  def query(event_ids)
    Event
      .where(id: event_ids)
      .joins(:signups)
      .group(:id)
      .pluck(:id, 'COUNT(*)')
  end
end
