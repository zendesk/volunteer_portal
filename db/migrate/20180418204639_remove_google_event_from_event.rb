class RemoveGoogleEventFromEvent < ActiveRecord::Migration[5.1]
  def change
    remove_column :events, :google_event
  end
end
