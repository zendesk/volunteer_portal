class AddDeletedAtToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :deleted_at, :datetime

    add_index :users, :deleted_at
    add_index :users, [:email, :deleted_at]

    remove_index :users, :email
  end
end
