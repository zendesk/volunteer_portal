module OfficeResolver
  class << self
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
  end
end
