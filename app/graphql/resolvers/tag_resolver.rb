module TagResolver
  class << self

    def create(_, args, _context)
      tag = Tag.new(args[:input].to_h)
      tag.save!

      tag
    end

    # def update(_, args, _context)
    # TODO
    # end

    def delete(_, args, _context)
      tag = Tag.find(args[:id])
      tag.destroy!

      tag
    end
  end
end
