class CreateIndividualEventTags < ActiveRecord::Migration[5.1]
  def change
    create_table :individual_event_tags do |t|
      t.references :individual_event, foreign_key: true
      t.references :tag, foreign_key: true

      t.timestamps
    end
  end
end
