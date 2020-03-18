module TagResolver
  class << self
    def create(_, args, _context)
      tag = Tag.new
      tag.name = args[:input].name
      tag.save!

      tag
    end

    def update(_, args, _context)
      tag = Tag.find(args[:input].id)
      tag.name = args[:input].name
      tag.save!

      tag
    end

    def delete(_, args, _context)
      tag = Tag.find(args[:id])
      tag.destroy!

      tag
    end
  end
end
