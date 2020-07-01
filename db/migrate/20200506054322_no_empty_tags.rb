class NoEmptyTags < ActiveRecord::Migration[5.1]
  def change
    return unless Tag.all.length.zero?

    [
      'New Hire', 'Skilled', 'Sustainability'
    ].each { |tag| Tag.find_or_create_by(name: tag) }
  end
end
