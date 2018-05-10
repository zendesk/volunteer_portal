class CreateEventTypes < ActiveRecord::Migration[4.2]
  def change
    create_table :event_types do |t|
      t.string :title

      t.timestamps null: false
    end
  end
end
