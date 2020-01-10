class DropVolunteers < ActiveRecord::Migration[5.1]
  def up
    remove_index :events_volunteers, name: 'by_event_and_volunteer'
    drop_table :events_volunteers
    drop_table :volunteers
  end

  def down
    create_table :volunteers do |t|
      t.text :name
      t.text :email
      t.timestamps
    end

    create_table :events_volunteers, id: false do |t|
      t.belongs_to :event
      t.belongs_to :volunteer
      t.timestamps
    end
    add_index :events_volunteers, [:event_id, :volunteer_id], unique: true, name: 'by_event_and_volunteer'
  end
end
