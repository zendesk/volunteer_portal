class EventsAndVolunteers < ActiveRecord::Migration[4.2]
  def change
    create_table :events_volunteers, id: false do |t|
      t.belongs_to :event
      t.belongs_to :volunteer
    end
  end
end
