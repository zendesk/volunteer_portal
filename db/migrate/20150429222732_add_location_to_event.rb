class AddLocationToEvent < ActiveRecord::Migration[4.2]
  def change
    add_column :events, :location, :string
  end
end
