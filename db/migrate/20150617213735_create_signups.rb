class CreateSignups < ActiveRecord::Migration[4.2]
  def change
    create_table :signups do |t|
      t.string :management_level
      t.string :office_location
      t.string :team
      t.boolean :fulfilled
      t.timestamps null: false
      t.integer :event_id
      t.integer :volunteer_id
      t.integer :hours_worked
    end
    add_index :signups, :event_id
    add_index :signups, :volunteer_id
  end
end
