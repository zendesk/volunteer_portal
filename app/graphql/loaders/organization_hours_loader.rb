class OrganizationHoursLoader < GraphQL::Batch::Loader
    def initialize(after: nil, before: nil)
      @after = after
      @before = before
    end
  
    def load(org)
      super(org.id)
    end
  
    def perform(org_ids)
      query(org_ids).each do |(org_id, duration)|
        hours = (duration / 60.0).round
        fulfill(org_id, hours)
      end
  
      # This is the fallback case to ensure we resolve the promise and return a
      # result for every user. `fullfilled?` will only return false if the block
      # above doesn't find and resolve for one of the `user_ids`.
      org_ids.each { |id| fulfill(id, 0) unless fulfilled?(id) }
    end
  
    private
  
    def query(org_ids)
      scope = Event.joins(:organization)
      scope = scope.after(Time.zone.at(@after)) if @after
      scope = scope.before(Time.zone.at(@before)) if @before

      scope
      .where(organization_id: org_ids)
      .group('"events"."organization_id"')
      .pluck('"events"."organization_id"', 'SUM((EXTRACT(EPOCH FROM "events"."ends_at") - EXTRACT(EPOCH FROM "events"."starts_at")) / 60)')
    end
  end
  