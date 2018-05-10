class CreateEvents < ActiveRecord::Migration[4.2]
  def change
    create_table :events do |t|
      t.text :description
      t.datetime :time
      t.integer :capacity
      t.integer :duration
      t.references :organization, index: true

      t.timestamps
    end
  end
end
