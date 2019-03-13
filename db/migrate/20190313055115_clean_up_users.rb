class CleanUpUsers < ActiveRecord::Migration[5.1]
  def up
    remove_column :users, :management_level
    remove_column :users, :interest
  end

  def down
    add_column :users, :management_level, :string
    add_column :users, :interest, :string
  end
end
