module OfficeResolver
  ALPHABETICAL_DESC = 'ALPHABETICAL_DESC'.freeze
  ALPHABETICAL_ASC = 'ALPHABETICAL_ASC'.freeze

  class << self
    def all(_object, args, context)
      scope = Office.all

      scope = scope_with_sort_by(scope, args[:sortBy])

      scope
    end

    def create(_, args, context)
      office = Office.new(args.input.to_h)
      office.save!

      office
    end

    def update(_, args, context)
      office = Office.find(args.input.id)
      office.update_attributes!(args.input.to_h.except(:id))

      office
    end

    def delete(_, args, context)
      office = Office.find(args.id)
      office.destroy!

      office
    end

    def scope_with_sort_by(scope, sort_by)
      return scope unless sort_by

      order = case sort_by
      when ALPHABETICAL_DESC
        :desc
      when ALPHABETICAL_ASC
        :asc
      end

      scope
        .order(name: order)
    end
  end
end
