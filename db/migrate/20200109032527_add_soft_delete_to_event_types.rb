class AddSoftDeleteToEventTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :event_types, :deleted_at, :datetime
  end
end
