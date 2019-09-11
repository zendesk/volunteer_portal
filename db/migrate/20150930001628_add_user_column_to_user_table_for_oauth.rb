class AddUserColumnToUserTableForOauth < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :photo, :string
    add_column :users, :management_level, :string
    add_column :users, :office_location, :string
    add_column :users, :team, :string
    add_column :users, :interest, :string
    add_column :users, :locale, :string
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    rename_column :signups, :volunteer_id, :user_id
  end
end
