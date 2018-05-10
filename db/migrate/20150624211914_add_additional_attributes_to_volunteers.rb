class AddAdditionalAttributesToVolunteers < ActiveRecord::Migration[4.2]
  def change
    add_column :volunteers, :photo, :string
    add_column :volunteers, :management_level, :string
    add_column :volunteers, :office_location, :string
    add_column :volunteers, :team, :string
    add_column :volunteers, :interest, :string
    add_column :volunteers, :locale, :string
  end
end
