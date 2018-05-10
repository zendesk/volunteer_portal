class AddEventTypeReferenceToEvents < ActiveRecord::Migration[4.2]
  def change
    add_reference :events, :event_type, index: true
  end
end
