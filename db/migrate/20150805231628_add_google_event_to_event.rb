class AddGoogleEventToEvent < ActiveRecord::Migration[4.2]
  def change
    add_column :events, :google_event, :string, limit: 3000
  end
end
