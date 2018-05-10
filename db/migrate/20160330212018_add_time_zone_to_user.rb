class AddTimeZoneToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :timezone, :string, null: false, default: 'UTC'
  end
end
