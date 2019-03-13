class DropOfficeLocation < ActiveRecord::Migration[5.1]
  def up
    remove_column :signups, :office_location
    remove_column :users, :office_location
    remove_column :volunteers, :office_location
  end

  def down
    add_column :signups, :office_location, :string
    add_column :users, :office_location, :string
    add_column :volunteers, :office_location, :string
  end
end
