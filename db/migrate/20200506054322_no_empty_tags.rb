class NoEmptyTags < ActiveRecord::Migration[5.1]
  def change
    if Tag.all.length == 0
      [
        'New Hire', 'Skilled', 'Sustainability'
      ].each { |tag| Tag.find_or_create_by(name: tag) }
    end
  end
end
