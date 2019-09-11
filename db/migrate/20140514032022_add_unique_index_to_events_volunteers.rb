class AddUniqueIndexToEventsVolunteers < ActiveRecord::Migration[4.2]
  def up
    add_index :events_volunteers, [:event_id, :volunteer_id], unique: true, name: 'by_event_and_volunteer'
  end

  def down
    remove_index 'by_event_and_volunteer'
  end
end
