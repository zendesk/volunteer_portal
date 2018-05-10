# This migration shouldn't change these column types, but we need it to stick around
# so just comment out column changes
class IntsToBigint < ActiveRecord::Migration[5.1]
  def up
    remove_foreign_key :users, :roles
    # change_column :users, :role_id, :bigint
  end

  def down
    # change_column :users, :role_id, :int
    add_foreign_key :users, :roles
  end
end
