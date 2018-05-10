class AddUpdatedAtIndex < ActiveRecord::Migration[4.2]
  def change
    add_index :events,        :updated_at
    add_index :event_types,   :updated_at
    add_index :organizations, :updated_at
    add_index :users,         :updated_at
  end
end
