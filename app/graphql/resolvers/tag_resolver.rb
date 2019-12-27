module TagResolver
  class << self

    def create(_, args, _context)
      tag = Tag.new(args[:input].to_h)
      tag.save!

      tag
    end

    # def update(_, args, _context)
    #   organization = Organization.find(args[:input].id)
    #   organization.update!(args[:input].to_h.except(:id))

    #   organization
    # end

    def delete(_, args, _context)
      tag = Tag.find(args[:id])
      tag.destroy!

      tag
    end
  end
end
